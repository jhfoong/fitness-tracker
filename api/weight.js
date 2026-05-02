// api/weight.js — Vercel serverless function
// Proxies weight log reads/writes to Notion (keeps API key server-side)

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_WEIGHT_DB_ID;
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!NOTION_TOKEN || !DB_ID) {
    return res.status(500).json({ error: "Notion env vars not configured" });
  }

  // ── GET: fetch all weight entries ─────────────────────────────────────────
  if (req.method === "GET") {
    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        sorts: [{ property: "Date", direction: "ascending" }],
        page_size: 100,
      }),
    });
    const data = await r.json();
    const entries = (data.results || []).map((page) => ({
      id: page.id,
      date: page.properties.Date?.date?.start || "",
      kg: page.properties.Weight_kg?.number ?? null,
    })).filter((e) => e.date && e.kg !== null);
    return res.json(entries);
  }

  // ── POST: create new weight entry ─────────────────────────────────────────
  if (req.method === "POST") {
    const { date, kg } = req.body;
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties: {
          Entry: { title: [{ text: { content: `${date} · ${kg} kg` } }] },
          Date: { date: { start: date } },
          Weight_kg: { number: kg },
        },
      }),
    });
    const page = await r.json();
    return res.json({ id: page.id, date, kg });
  }

  // ── PATCH: update an entry's weight ───────────────────────────────────────
  if (req.method === "PATCH") {
    const { id, kg } = req.body;
    await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "PATCH",
      headers: notionHeaders(),
      body: JSON.stringify({
        properties: { Weight_kg: { number: kg } },
      }),
    });
    return res.json({ ok: true });
  }

  // ── DELETE: archive an entry ──────────────────────────────────────────────
  if (req.method === "DELETE") {
    const { id } = req.body;
    await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "PATCH",
      headers: notionHeaders(),
      body: JSON.stringify({ archived: true }),
    });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
