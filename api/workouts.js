// api/workouts.js — Vercel serverless function
// Proxies daily workout log reads/writes to Notion (keeps API key server-side)

const NOTION_TOKEN  = process.env.NOTION_TOKEN;
const DB_ID         = process.env.NOTION_WORKOUTS_DB_ID;
const NOTION_VERSION = "2022-06-28";

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!NOTION_TOKEN || !DB_ID) {
    return res.status(500).json({ error: "Notion env vars not configured" });
  }

  // ── GET: fetch workout rows for a date range (e.g. current week) ──────────
  if (req.method === "GET") {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: "from and to params required" });

    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Date", date: { on_or_after: from } },
            { property: "Date", date: { on_or_before: to } },
          ],
        },
        sorts: [{ property: "Date", direction: "ascending" }],
      }),
    });
    const data = await r.json();
    const rows = (data.results || []).map(page => ({
      id:           page.id,
      date:         page.properties.Date?.date?.start || "",
      mode:         page.properties.Mode?.select?.name || "",
      warmupDone:   page.properties.Warmup_Done?.checkbox || false,
      sessionDone:  page.properties.Session_Done?.checkbox || false,
      bbarCount:    page.properties.Bbar_Count?.number ?? 0,
    })).filter(r => r.date);
    return res.json(rows);
  }

  // ── POST: create a new workout row ────────────────────────────────────────
  if (req.method === "POST") {
    const { date, mode, warmupDone, sessionDone, bbarCount } = req.body;
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties: {
          Entry:        { title: [{ text: { content: `${date} · ${mode}` } }] },
          Date:         { date: { start: date } },
          Mode:         { select: { name: mode } },
          Warmup_Done:  { checkbox: !!warmupDone },
          Session_Done: { checkbox: !!sessionDone },
          Bbar_Count:   { number: bbarCount ?? 0 },
        },
      }),
    });
    const page = await r.json();
    return res.json({ id: page.id, date, mode, warmupDone, sessionDone, bbarCount });
  }

  // ── PATCH: update an existing workout row ─────────────────────────────────
  if (req.method === "PATCH") {
    const { id, mode, warmupDone, sessionDone, bbarCount } = req.body;
    const properties = {};
    if (mode         !== undefined) properties.Mode         = { select: { name: mode } };
    if (warmupDone   !== undefined) properties.Warmup_Done  = { checkbox: !!warmupDone };
    if (sessionDone  !== undefined) properties.Session_Done = { checkbox: !!sessionDone };
    if (bbarCount    !== undefined) properties.Bbar_Count   = { number: bbarCount };
    await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "PATCH",
      headers: notionHeaders(),
      body: JSON.stringify({ properties }),
    });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
