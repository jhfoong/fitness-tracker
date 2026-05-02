// api/habits.js — Vercel serverless function
// Proxies daily habit reads/writes to Notion (keeps API key server-side)

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_HABITS_DB_ID;
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!NOTION_TOKEN || !DB_ID) {
    return res.status(500).json({ error: "Notion env vars not configured" });
  }

  // ── GET: fetch all habits for a given date ────────────────────────────────
  if (req.method === "GET") {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date param required" });

    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: { property: "Date", date: { equals: date } },
      }),
    });
    const data = await r.json();

    // Return map of habitId -> { notionId, done }
    const habits = {};
    (data.results || []).forEach((page) => {
      const habitId = page.properties.Habit_ID?.rich_text?.[0]?.plain_text;
      const done = page.properties.Done?.checkbox || false;
      if (habitId) habits[habitId] = { notionId: page.id, done };
    });
    return res.json(habits);
  }

  // ── POST: create or update a habit entry ──────────────────────────────────
  if (req.method === "POST") {
    const { date, habitId, done, notionId } = req.body;

    if (notionId) {
      // Update existing page
      await fetch(`https://api.notion.com/v1/pages/${notionId}`, {
        method: "PATCH",
        headers: notionHeaders(),
        body: JSON.stringify({
          properties: { Done: { checkbox: done } },
        }),
      });
      return res.json({ ok: true, notionId });
    } else {
      // Create new page
      const r = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: notionHeaders(),
        body: JSON.stringify({
          parent: { database_id: DB_ID },
          properties: {
            Entry: { title: [{ text: { content: `${date} · ${habitId}` } }] },
            Date: { date: { start: date } },
            Habit_ID: { rich_text: [{ text: { content: habitId } }] },
            Done: { checkbox: done },
          },
        }),
      });
      const page = await r.json();
      return res.json({ ok: true, notionId: page.id });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
