import { useState, useEffect, useRef } from "react";

// ─── Data imports ────────────────────────────────────────────────────────────
import { WARMUP, SESSIONS, WEEKLY_SCHEDULE, DAY_ORDER, getWeekVariant, resolveSession } from "./data/workouts";
import { USER, PILLARS, DAILY_HABITS, STRETCH_ROUTINE, ROADMAP } from "./data/coaching";

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0f1117", surface: "#1a1d27", surface2: "#222534", surface3: "#2a2d40",
  border: "#2e3347", txtPrimary: "#f0f2fa", txtSecondary: "#9aa3c2", txtMuted: "#6b7492",
  blue: "#60a5fa", green: "#34d399", purple: "#a78bfa", red: "#f87171",
  amber: "#f59e0b", success: "#4ade80", warning: "#fbbf24",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const s = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(";");

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function getTodayKey() {
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
}

// Full date key for habits — resets each calendar day
function getTodayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmt(n) { return Math.round(n).toLocaleString(); }

// ─── Date helpers ─────────────────────────────────────────────────────────────
// Display a date string (handles both ISO YYYY-MM-DD and legacy DD/MM/YYYY)
function displayDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateStr; // already DD/MM/YYYY (legacy)
}

// Convert any date string to ISO YYYY-MM-DD (for date inputs and Notion)
function toISODate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) return dateStr; // already ISO
  const [d, m, y] = dateStr.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// Returns the Monday of the week containing `date` (midnight local time)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

// True if weightLog has at least one entry dated in the current Mon–Sun week
function hasWeightThisWeek(weightLog) {
  const weekStart = getWeekStart(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return weightLog.some(entry => {
    const iso = toISODate(entry.date);
    if (iso.length !== 10) return false;
    const d = new Date(iso);
    return d >= weekStart && d < weekEnd;
  });
}

// ─── Notion sync helpers ──────────────────────────────────────────────────────
async function notionPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} POST ${res.status}`);
  return res.json();
}

async function notionPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} PATCH ${res.status}`);
  return res.json();
}

async function notionDelete(path, body) {
  const res = await fetch(path, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} DELETE ${res.status}`);
  return res.json();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Pill({ label, bg, color, border }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
      background: bg, color, border: `0.5px solid ${border || color}` }}>
      {label}
    </span>
  );
}

function SectionHeader({ number, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: color + "22",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 600, color, flexShrink: 0 }}>
        {number}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: T.txtPrimary, margin: 0 }}>{title}</h2>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: "16px 18px", ...style }}>
      {children}
    </div>
  );
}

// ── Rest Timer ────────────────────────────────────────────────────────────────
function RestTimer({ onDone }) {
  const [secs, setSecs] = useState(75);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setTimeout(() => setSecs(s => s - 1), 1000);
    } else if (secs === 0) {
      setRunning(false);
      onDone?.();
    }
    return () => clearTimeout(ref.current);
  }, [running, secs]);

  const pct = ((75 - secs) / 75) * 100;

  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 12px" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke={T.surface2} strokeWidth="6"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke={secs === 0 ? T.green : T.blue}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset 1s linear" }}/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20, fontWeight: 700, color: T.txtPrimary }}>
          {secs}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={() => setRunning(r => !r)}
          style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${T.border}`,
            background: running ? T.surface3 : T.blue, color: T.txtPrimary,
            fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {running ? "Pause" : secs === 75 ? "Start rest" : "Resume"}
        </button>
        <button onClick={() => { setSecs(75); setRunning(false); }}
          style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.txtMuted, fontSize: 13, cursor: "pointer" }}>
          Reset
        </button>
      </div>
    </div>
  );
}

// ── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({ ex, isOptional, completedSets, onSetDone, showTimer, onToggleTimer }) {
  const [open, setOpen] = useState(false);
  const totalSets = ex.sets || 3;
  const done = completedSets || 0;
  const allDone = done >= totalSets;

  return (
    <div style={{ background: isOptional ? "#12121f" : T.surface,
      border: `1px solid ${open ? T.blue : isOptional ? "#2a2050" : T.border}`,
      borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s",
      opacity: allDone ? 0.6 : 1 }}>

      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
        <span style={{ width: 4, height: 36, borderRadius: 4, background: ex.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: allDone ? T.txtMuted : T.txtPrimary }}>
              {ex.name}
            </span>
            {isOptional && ex.barHeight && (
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20,
                background: "#1e3a5f", color: "#93c5fd", border: "0.5px solid #1e4a7f" }}>
                {ex.barHeight}
              </span>
            )}
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20,
              background: T.surface3, color: T.txtMuted }}>
              {ex.tag}
            </span>
          </div>
          <span style={{ fontSize: 12, color: T.txtSecondary }}>
            {isOptional ? `${ex.sets} · ${ex.freq}` : `${ex.sets} sets · ${ex.repsLabel}`}
          </span>
        </div>

        {!isOptional && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: totalSets }).map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); onSetDone(i); }}
                style={{ width: 28, height: 28, borderRadius: "50%",
                  border: `1.5px solid ${i < done ? ex.color : T.border}`,
                  background: i < done ? ex.color + "33" : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: i < done ? ex.color : T.txtMuted,
                  transition: "all 0.15s" }}>
                {i < done ? "✓" : i + 1}
              </button>
            ))}
          </div>
        )}
        <span style={{ fontSize: 11, color: T.txtMuted, marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${T.border}`, background: T.surface2, padding: "13px 16px" }}>
          <p style={{ fontSize: 12, color: T.txtSecondary, lineHeight: 1.7, marginBottom: 10 }}>
            {ex.cue}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {ex.muscles?.map(m => (
              <span key={m} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20,
                background: T.surface, color: T.txtSecondary, border: `0.5px solid ${T.border}` }}>
                {m}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={ex.video} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
                fontWeight: 600, padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
                background: "transparent", color: T.txtPrimary, textDecoration: "none" }}>
              <span style={{ fontSize: 14 }}>▶</span> Watch tutorial · {ex.channel} ↗
            </a>
            {!isOptional && (
              <button onClick={onToggleTimer}
                style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
                  background: showTimer ? T.blue + "22" : "transparent",
                  color: showTimer ? T.blue : T.txtMuted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {showTimer ? "Hide timer" : "Rest timer"}
              </button>
            )}
          </div>
          {showTimer && !isOptional && <RestTimer />}
        </div>
      )}
    </div>
  );
}

// ── Warm-up Panel ────────────────────────────────────────────────────────────
function WarmUpPanel() {
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <Card style={{ marginBottom: 14, borderColor: done ? T.green + "66" : T.amber + "66" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: done ? T.green : T.amber, margin: 0 }}>
              Warm-up · 3 minutes {done ? "✓" : ""}
            </p>
            <p style={{ fontSize: 11, color: T.txtMuted, margin: 0 }}>
              Non-negotiable at 35+ — do this before every session
            </p>
          </div>
        </div>
        <span style={{ fontSize: 11, color: T.txtMuted }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {WARMUP.map((w, i) => (
              <div key={i} style={{ background: T.surface2, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.txtPrimary }}>{w.name}</span>
                  <span style={{ fontSize: 12, color: T.amber }}>{w.reps}</span>
                </div>
                <p style={{ fontSize: 12, color: T.txtSecondary, margin: 0, lineHeight: 1.6 }}>{w.cue}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setDone(true)}
            style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 8,
              border: `1px solid ${done ? T.green : T.amber}`,
              background: done ? T.green + "22" : T.amber + "22",
              color: done ? T.green : T.amber, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {done ? "Warm-up complete ✓" : "Mark warm-up done"}
          </button>
        </>
      )}
    </Card>
  );
}

// ── Weight Chart ──────────────────────────────────────────────────────────────
function WeightChart({ data, viewMode }) {
  // Build points based on view mode
  let points = [];

  if (viewMode === "month") {
    points = data.slice(-30);
  } else {
    // Year view: last entry per calendar month, last 12 months
    const monthMap = {};
    data.forEach(entry => {
      const iso = toISODate(entry.date); // normalise to YYYY-MM-DD
      if (iso.length === 10) {
        const key = iso.slice(0, 7); // YYYY-MM
        monthMap[key] = entry.kg;
      }
    });
    const sortedKeys = Object.keys(monthMap).sort().slice(-12);
    points = sortedKeys.map(key => ({ date: key, kg: monthMap[key] }));
  }

  if (points.length < 2) {
    return (
      <div style={{ padding: "24px 0", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: T.txtMuted, margin: 0 }}>
          Log at least 2 entries to see your trend
        </p>
      </div>
    );
  }

  const W = 320, H = 160;
  const padL = 36, padR = 28, padT = 16, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const allKg = points.map(p => p.kg);
  const minKg = Math.min(...allKg, USER.goalWeightKg) - 1;
  const maxKg = Math.max(...allKg) + 1;
  const range = maxKg - minKg || 1;

  const xScale = i => padL + (i / (points.length - 1)) * chartW;
  const yScale = kg => padT + chartH - ((kg - minKg) / range) * chartH;
  const goalY = yScale(USER.goalWeightKg);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(1)} ${yScale(p.kg).toFixed(1)}`).join(" ");

  // X-axis labels: show ~5 labels max
  const labelStep = Math.max(1, Math.ceil(points.length / 5));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      {/* Horizontal grid + Y labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const kg = minKg + pct * range;
        const y = padT + chartH - pct * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
              stroke={T.border} strokeWidth="0.5" />
            <text x={padL - 4} y={y + 3.5} fill={T.txtMuted} fontSize="8" textAnchor="end">
              {Math.round(kg)}
            </text>
          </g>
        );
      })}

      {/* Goal line */}
      <line x1={padL} y1={goalY} x2={W - padR} y2={goalY}
        stroke={T.green} strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7" />
      <text x={W - padR + 3} y={goalY + 3.5} fill={T.green} fontSize="8" opacity="0.8">goal</text>

      {/* Weight line */}
      <path d={linePath} fill="none" stroke={T.blue} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xScale(i)} cy={yScale(p.kg)} r="4"
            fill={T.blue} stroke={T.surface} strokeWidth="2" />
          {/* Value label on first and last */}
          {(i === 0 || i === points.length - 1) && (
            <text x={xScale(i)} y={yScale(p.kg) - 8}
              fill={T.txtPrimary} fontSize="8.5" textAnchor="middle" fontWeight="600">
              {p.kg}
            </text>
          )}
        </g>
      ))}

      {/* X-axis labels */}
      {points.map((p, i) => {
        if (i !== 0 && i !== points.length - 1 && i % labelStep !== 0) return null;
        let label;
        if (viewMode === "month") {
          const iso = toISODate(p.date); // normalise to YYYY-MM-DD
          label = iso.length === 10 ? `${iso.slice(8)}/${iso.slice(5, 7)}` : p.date; // DD/MM
        } else {
          const [y, m] = p.date.split("-");
          label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-AU", { month: "short" });
        }
        return (
          <text key={i} x={xScale(i)} y={H - 4}
            fill={T.txtMuted} fontSize="8" textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Navigation tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "habits", label: "Habits" },
  { id: "coaching", label: "Coaching" },
  { id: "progress", label: "Progress" },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function WorkoutDashboard() {
  const [tab, setTab] = useLocalStorage("wt_tab", "today");
  const [weekMode, setWeekMode] = useLocalStorage("wt_mode", "busy");
  const [completedSets, setCompletedSets] = useLocalStorage("wt_sets", {});
  const [habitLog, setHabitLog] = useLocalStorage("wt_habits", {});
  const [weightLog, setWeightLog] = useLocalStorage("wt_weight", []);
  const [newWeight, setNewWeight] = useState("");
  const [openTimers, setOpenTimers] = useState({});
  const [openStretch, setOpenStretch] = useState(null);
  const [openPillar, setOpenPillar] = useState(null);
  const [chartView, setChartView] = useState("month");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState("");
  const [syncStatus, setSyncStatus] = useState(null); // null | "syncing" | "synced" | "offline"

  const today = getTodayKey();
  const variant = getWeekVariant(); // "A" or "B" — switches every 2 weeks

  // ── Load from Notion on mount (cross-device sync) ─────────────────────────
  useEffect(() => {
    async function loadFromNotion() {
      setSyncStatus("syncing");
      let ok = true;
      try {
        // Weight log
        const wRes = await fetch("/api/weight");
        if (wRes.ok) {
          const entries = await wRes.json();
          if (entries.length > 0) {
            setWeightLog(entries.map(e => ({ date: e.date, kg: e.kg, notionId: e.id })));
          }
        }
      } catch { ok = false; }

      try {
        // Today's habits
        const date = getTodayDateKey();
        const hRes = await fetch(`/api/habits?date=${date}`);
        if (hRes.ok) {
          const notionHabits = await hRes.json();
          if (Object.keys(notionHabits).length > 0) {
            setHabitLog(prev => {
              const updated = { ...prev };
              Object.entries(notionHabits).forEach(([habitId, { notionId, done }]) => {
                updated[`${date}_${habitId}`] = { done, notionId };
              });
              return updated;
            });
          }
        }
      } catch { ok = false; }

      setSyncStatus(ok ? "synced" : "offline");
      setTimeout(() => setSyncStatus(null), 3000);
    }
    loadFromNotion();
  }, []);
  const todaySchedule = WEEKLY_SCHEDULE[weekMode][today];
  const todaySession = resolveSession(todaySchedule, variant);
  const isOptionalDay = !!todaySchedule?.optional;
  const isRestDay = !todaySession?.exercises?.length;

  function toggleSet(exId, setIdx) {
    setCompletedSets(prev => {
      const key = `${today}_${exId}`;
      const cur = prev[key] || 0;
      return { ...prev, [key]: setIdx < cur ? setIdx : setIdx + 1 };
    });
  }

  function getCompleted(exId) {
    return completedSets[`${today}_${exId}`] || 0;
  }

  // Handles both legacy boolean values and new { done, notionId } objects
  function habitDone(id) {
    const val = habitLog[`${getTodayDateKey()}_${id}`];
    if (val && typeof val === "object") return val.done;
    return !!val;
  }

  function habitNotionId(id) {
    const val = habitLog[`${getTodayDateKey()}_${id}`];
    if (val && typeof val === "object") return val.notionId || null;
    return null;
  }

  async function toggleHabit(id) {
    const key = `${getTodayDateKey()}_${id}`;
    const newDone = !habitDone(id);
    const existingNotionId = habitNotionId(id);

    // Optimistic update immediately
    setHabitLog(prev => ({ ...prev, [key]: { done: newDone, notionId: existingNotionId } }));

    // Background sync to Notion
    try {
      const data = await notionPost("/api/habits", {
        date: getTodayDateKey(), habitId: id, done: newDone, notionId: existingNotionId,
      });
      if (data.notionId && !existingNotionId) {
        setHabitLog(prev => ({ ...prev, [key]: { done: newDone, notionId: data.notionId } }));
      }
    } catch { /* offline — localStorage already updated */ }
  }

  async function addWeight() {
    const w = parseFloat(newWeight);
    if (!w || w < 40 || w > 200) return;
    const entry = { date: getTodayDateKey(), kg: w };
    setWeightLog(prev => [...prev, entry]);
    setNewWeight("");
    try {
      const data = await notionPost("/api/weight", entry);
      if (data.id) {
        setWeightLog(prev => prev.map((e, i) =>
          i === prev.length - 1 && !e.notionId ? { ...e, notionId: data.id } : e
        ));
      }
    } catch { /* offline — entry saved to localStorage */ }
  }

  async function deleteWeight(idx) {
    const entry = weightLog[idx];
    setWeightLog(prev => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) { setEditingIdx(null); setEditValue(""); }
    if (entry?.notionId) {
      try { await notionDelete("/api/weight", { id: entry.notionId }); } catch {}
    }
  }

  function startEdit(idx, kg, date) {
    setEditingIdx(idx);
    setEditValue(String(kg));
    setEditDate(toISODate(date));
  }

  async function saveEdit(idx) {
    const w = parseFloat(editValue);
    if (!w || w < 40 || w > 200) return;
    if (!editDate) return;
    const entry = weightLog[idx];
    setWeightLog(prev => prev.map((e, i) => i === idx ? { ...e, kg: w, date: editDate } : e));
    setEditingIdx(null);
    setEditValue("");
    setEditDate("");
    if (entry?.notionId) {
      try { await notionPatch("/api/weight", { id: entry.notionId, kg: w, date: editDate }); } catch {}
    }
  }

  const sessionExercises = todaySession?.exercises || [];
  const sessionBbars = todaySession?.bbars || [];
  const doneCount = sessionExercises.filter(ex => getCompleted(ex.id) >= (ex.sets || 3)).length;
  const sessionComplete = sessionExercises.length > 0 && doneCount === sessionExercises.length;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "1.5rem",
      fontFamily: "system-ui, sans-serif", color: T.txtPrimary, boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: T.txtPrimary }}>
            Fitness tracker
          </h1>
          <p style={{ fontSize: 13, color: T.txtSecondary, margin: 0 }}>
            85 kg · 170 cm · male · mid-30s · goal: −10 kg + maintain muscle
          </p>
        </div>
        {syncStatus && (
          <div style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
            background: syncStatus === "offline" ? T.red + "22" : T.green + "22",
            color: syncStatus === "offline" ? T.red : T.green,
            border: `0.5px solid ${syncStatus === "offline" ? T.red : T.green}44`,
            marginTop: 4, whiteSpace: "nowrap" }}>
            {syncStatus === "syncing" ? "⟳ Syncing…" : syncStatus === "synced" ? "✓ Synced" : "⚠ Offline"}
          </div>
        )}
      </div>

      {/* Week mode toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { key: "busy", label: "Busy week", sub: "3 days + optional Sat" },
          { key: "regular", label: "Regular week", sub: "4 days + optional Sat" },
        ].map(({ key, label, sub }) => (
          <button key={key} onClick={() => setWeekMode(key)}
            style={{ flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
              textAlign: "left", border: weekMode === key ? `2px solid ${T.blue}` : `1px solid ${T.border}`,
              background: weekMode === key ? "#1e3a5f" : T.surface, outline: "none" }}>
            <div style={{ fontSize: 13, fontWeight: 600,
              color: weekMode === key ? "#93c5fd" : T.txtSecondary }}>{label}</div>
            <div style={{ fontSize: 11, color: weekMode === key ? "#60a5fa" : T.txtMuted, opacity: 0.85 }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.surface,
        borderRadius: 10, padding: 4, border: `1px solid ${T.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: "none",
              background: tab === t.id ? T.surface3 : "transparent",
              color: tab === t.id ? T.txtPrimary : T.txtMuted,
              fontSize: 12, fontWeight: tab === t.id ? 600 : 400, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TODAY TAB ─────────────────────────────────────────────────────── */}
      {tab === "today" && (
        <div>
          {/* Day header */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 11, color: T.txtMuted, margin: 0 }}>
                    {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  {/* Week A/B variant badge */}
                  {!isRestDay && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 20,
                      background: variant === "A" ? T.blue + "22" : T.purple + "22",
                      color: variant === "A" ? T.blue : T.purple,
                      border: `0.5px solid ${variant === "A" ? T.blue : T.purple}66` }}>
                      Week {variant}
                    </span>
                  )}
                  {/* Optional day badge */}
                  {isOptionalDay && !isRestDay && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 20,
                      background: T.amber + "22", color: T.amber, border: `0.5px solid ${T.amber}66` }}>
                      Optional
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: isOptionalDay && !isRestDay ? T.amber : (todaySession?.color || T.txtMuted), margin: "0 0 4px" }}>
                  {isRestDay ? "Rest day" : isOptionalDay ? `Optional — ${todaySession?.label}` : todaySession?.label}
                </p>
                <p style={{ fontSize: 12, color: T.txtSecondary, margin: 0 }}>
                  {todaySchedule?.note}
                </p>
              </div>
              {!isRestDay && (
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: sessionComplete ? T.green : T.blue, margin: 0 }}>
                    {doneCount}/{sessionExercises.length}
                  </p>
                  <p style={{ fontSize: 11, color: T.txtMuted, margin: 0 }}>exercises done</p>
                </div>
              )}
            </div>
            {sessionComplete && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: T.green + "22",
                borderRadius: 8, border: `1px solid ${T.green}66` }}>
                <p style={{ fontSize: 13, color: T.green, fontWeight: 600, margin: 0 }}>
                  Session complete! Great work today ✓
                </p>
              </div>
            )}
          </Card>

          {/* Warm-up */}
          {!isRestDay && <WarmUpPanel />}

          {/* Main exercises */}
          {!isRestDay && sessionExercises.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.txtPrimary, margin: "0 0 10px" }}>
                Main session
                <span style={{ fontSize: 11, color: T.txtMuted, marginLeft: 8, fontWeight: 400 }}>
                  tap to expand · tap circles to log sets
                </span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessionExercises.map(ex => (
                  <ExerciseCard key={ex.id} ex={ex}
                    completedSets={getCompleted(ex.id)}
                    onSetDone={(i) => toggleSet(ex.id, i)}
                    showTimer={openTimers[ex.id]}
                    onToggleTimer={() => setOpenTimers(t => ({ ...t, [ex.id]: !t[ex.id] }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* B-Bars — only on workout days (rest days show B-Bars inside the rest card below) */}
          {!isRestDay && sessionBbars.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", margin: "0 0 6px" }}>
                B-Bars desk breaks
                <span style={{ fontSize: 11, color: T.txtMuted, marginLeft: 8, fontWeight: 400 }}>
                  2–5 reps, fresh, scattered through the day
                </span>
              </p>
              <div style={{ background: "#12121f", border: "1px solid #2a2050", borderRadius: 10,
                padding: "10px 14px", marginBottom: 10, fontSize: 12, color: T.txtSecondary, lineHeight: 1.6 }}>
                Keep reps well within your ability. Never do these fatigued — always fresh.
                Dead hang = 3–5 times a day.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessionBbars.map(ex => (
                  <ExerciseCard key={ex.id} ex={ex} isOptional />
                ))}
              </div>
            </div>
          )}

          {/* Rest day — combined active rest + B-Bars in one card */}
          {isRestDay && (
            <Card>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, marginBottom: 8 }}>
                Active rest day
              </p>
              <p style={{ fontSize: 13, color: T.txtSecondary, lineHeight: 1.7, marginBottom: 14 }}>
                Take a 20–30 min walk. End with the 10-min stretch routine if it's one of your stretch days.
                B-Bars below are perfect today — no recovery cost, huge spine and mobility benefit.
              </p>
              {sessionBbars.length > 0 && (
                <>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.purple, margin: "0 0 8px" }}>
                    B-Bars · anytime today
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sessionBbars.map(ex => (
                      <ExerciseCard key={ex.id} ex={ex} isOptional />
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      )}

      {/* ── WEEK TAB ──────────────────────────────────────────────────────── */}
      {tab === "week" && (
        <div>
          {/* Week A/B indicator */}
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20,
              background: variant === "A" ? T.blue + "22" : T.purple + "22",
              color: variant === "A" ? T.blue : T.purple,
              border: `1px solid ${variant === "A" ? T.blue : T.purple}55` }}>
              Week {variant}
            </span>
            <span style={{ fontSize: 12, color: T.txtMuted }}>
              Exercises rotate every 2 weeks
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 8, marginBottom: 20 }}>
            {DAY_ORDER.map(day => {
              const sched = WEEKLY_SCHEDULE[weekMode][day];
              const sess = resolveSession(sched, variant);
              const isToday = day === today;
              const isRest = !sess?.exercises?.length;
              const isOpt = !!sched?.optional;
              const dotColor = isOpt ? T.amber : (sess?.color || T.txtMuted);
              return (
                <div key={day} style={{ borderRadius: 10, padding: "10px 6px", textAlign: "center",
                  border: `${isToday ? "2px" : "1px"} solid ${isToday ? dotColor : T.border}`,
                  background: isToday ? dotColor + "22" : T.surface,
                  opacity: isRest && !isToday ? 0.5 : 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: dotColor, marginBottom: 4 }}>
                    {day}
                  </div>
                  <div style={{ fontSize: 9, color: dotColor, opacity: 0.85, lineHeight: 1.4 }}>
                    {isRest ? "Rest" : isOpt ? "Opt" : sess?.label}
                  </div>
                </div>
              );
            })}
          </div>

          {DAY_ORDER.map(day => {
            const sched = WEEKLY_SCHEDULE[weekMode][day];
            const sess = resolveSession(sched, variant);
            const isRest = !sess?.exercises?.length;
            const isOpt = !!sched?.optional;
            const labelColor = isOpt ? T.amber : (sess?.color || T.txtMuted);
            return (
              <Card key={day} style={{ marginBottom: 10, borderColor: isOpt ? T.amber + "44" : T.border }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isRest && !sched?.note ? 0 : 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: labelColor }}>{day} — </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.txtPrimary }}>
                      {isRest ? "Rest" : sess?.label}
                    </span>
                    {isOpt && !isRest && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 20,
                        background: T.amber + "22", color: T.amber, border: `0.5px solid ${T.amber}66` }}>
                        Optional
                      </span>
                    )}
                  </div>
                  {sched?.note && !isOpt ? (
                    <span style={{ fontSize: 11, color: T.amber, background: T.amber + "15",
                      padding: "2px 8px", borderRadius: 20, border: `0.5px solid ${T.amber}44` }}>
                      {sched.note}
                    </span>
                  ) : null}
                </div>
                {isOpt && !isRest && (
                  <p style={{ fontSize: 11, color: T.amber, opacity: 0.85, margin: "0 0 8px" }}>
                    {sched.note}
                  </p>
                )}
                {!isRest && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sess.exercises.map(ex => (
                      <span key={ex.id} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20,
                        background: ex.color + "22", color: ex.color, border: `0.5px solid ${ex.color}44` }}>
                        {ex.name}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── HABITS TAB ────────────────────────────────────────────────────── */}
      {tab === "habits" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: T.txtSecondary, lineHeight: 1.7, marginBottom: 14 }}>
              Six daily habits. Not twenty. These create 80% of the results.
              Tick them off as you go — they reset every day.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DAILY_HABITS.filter(h => {
                // Hide the weigh-in habit once a weight entry exists for this week
                if (h.id === "weighin") return !hasWeightThisWeek(weightLog);
                return true;
              }).map(h => {
                const done = habitDone(h.id);
                return (
                  <div key={h.id} onClick={() => toggleHabit(h.id)}
                    style={{ background: done ? h.color + "11" : T.surface,
                      border: `1px solid ${done ? h.color + "66" : T.border}`,
                      borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                      transition: "all 0.15s", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      border: `2px solid ${done ? h.color : T.border}`,
                      background: done ? h.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: T.bg, fontWeight: 700, transition: "all 0.15s" }}>
                      {done ? "✓" : ""}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: h.color, margin: "0 0 3px", fontWeight: 600 }}>{h.time}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: done ? T.txtMuted : T.txtPrimary,
                        margin: "0 0 5px", textDecoration: done ? "line-through" : "none" }}>
                        {h.name}
                      </p>
                      <p style={{ fontSize: 12, color: T.txtSecondary, margin: 0, lineHeight: 1.6 }}>{h.why}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stretch routine */}
          <Card>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, margin: "0 0 4px" }}>
              Weekly stretch routine
            </p>
            <p style={{ fontSize: 12, color: T.txtSecondary, margin: "0 0 14px" }}>
              10 min · once per week minimum · end your rest day walk with this
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STRETCH_ROUTINE.map((st, i) => (
                <div key={st.id} style={{ borderLeft: `3px solid ${st.color}`, borderRadius: 0,
                  padding: "10px 14px", background: T.surface2, cursor: "pointer" }}
                  onClick={() => setOpenStretch(openStretch === i ? null : i)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: st.color, margin: 0 }}>{st.name}</p>
                    <span style={{ fontSize: 11, color: T.txtMuted }}>{st.duration}</span>
                  </div>
                  <p style={{ fontSize: 11, color: T.txtMuted, margin: "2px 0 0" }}>{st.target}</p>
                  {openStretch === i && (
                    <p style={{ fontSize: 12, color: T.txtSecondary, margin: "10px 0 0", lineHeight: 1.7 }}>
                      {st.cue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── COACHING TAB ──────────────────────────────────────────────────── */}
      {tab === "coaching" && (
        <div>
          <SectionHeader number="1" title="The 5 pillars" color={T.blue} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 10, marginBottom: 24 }}>
            {PILLARS.map(p => (
              <div key={p.id} style={{ background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}
                onClick={() => setOpenPillar(openPillar === p.id ? null : p.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, margin: 0 }}>{p.label}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
                    background: p.statusBg, color: p.color, border: `0.5px solid ${p.color}66` }}>
                    {p.status}
                  </span>
                </div>
                {openPillar === p.id && (
                  <div style={{ marginTop: 10 }}>
                    {p.rules.map((r, i) => (
                      <p key={i} style={{ fontSize: 12, color: T.txtSecondary, lineHeight: 1.7,
                        margin: "0 0 4px", display: "flex", gap: 8 }}>
                        <span style={{ color: T.txtMuted, flexShrink: 0 }}>—</span>{r}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <SectionHeader number="2" title="3-month roadmap" color={T.green} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {ROADMAP.map(phase => (
              <div key={phase.month} style={{ borderRadius: 12, overflow: "hidden",
                border: `1px solid ${T.border}` }}>
                <div style={{ padding: "12px 16px", background: phase.bg,
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: phase.color + "33",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: phase.color, flexShrink: 0 }}>
                    {phase.month}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: phase.color, margin: "0 0 2px" }}>
                      Month {phase.month} — {phase.label}
                    </p>
                    <p style={{ fontSize: 11, color: phase.color, opacity: 0.8, margin: 0 }}>{phase.focus}</p>
                  </div>
                </div>
                <div style={{ padding: "12px 16px", background: T.surface2 }}>
                  <p style={{ fontSize: 12, color: T.txtSecondary, lineHeight: 1.7, marginBottom: 10 }}>
                    {phase.description}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {phase.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20,
                        background: T.surface, color: T.txtSecondary, border: `0.5px solid ${T.border}` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <p style={{ fontSize: 14, fontWeight: 600, color: T.txtPrimary, marginBottom: 8 }}>
              A note worth keeping in mind
            </p>
            <p style={{ fontSize: 13, color: T.txtSecondary, lineHeight: 1.7, margin: 0 }}>
              You're starting this in your mid-30s with a demanding job and a real life. That's not a
              disadvantage — it's actually when commitment tends to stick, because the motivation is genuine.
              The goal isn't to become an athlete overnight. It's to build a body and daily system that makes
              you feel strong, energetic, and in control of your health for the next 30 years. This plan does
              that. Now the only variable is showing up.
            </p>
          </Card>
        </div>
      )}

      {/* ── PROGRESS TAB ──────────────────────────────────────────────────── */}
      {tab === "progress" && (
        <div>
          <Card style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, margin: "0 0 14px" }}>
              Weight tracker
            </p>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Starting", val: `${USER.weightKg} kg`, color: T.txtSecondary },
                { label: "Current", val: weightLog.length ? `${weightLog[weightLog.length - 1].kg} kg` : "—", color: T.blue },
                { label: "Goal", val: `${USER.goalWeightKg} kg`, color: T.green },
              ].map(c => (
                <div key={c.label} style={{ background: T.surface2, borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 11, color: T.txtMuted, margin: "0 0 4px" }}>{c.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: c.color, margin: 0 }}>{c.val}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            {weightLog.length >= 2 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.txtPrimary, margin: 0 }}>Progress chart</p>
                  <div style={{ display: "flex", background: T.surface2, borderRadius: 8, padding: 3,
                    border: `1px solid ${T.border}` }}>
                    {["month", "year"].map(v => (
                      <button key={v} onClick={() => setChartView(v)}
                        style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                          background: chartView === v ? T.surface3 : "transparent",
                          color: chartView === v ? T.txtPrimary : T.txtMuted,
                          fontSize: 11, fontWeight: chartView === v ? 600 : 400 }}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: T.surface2, borderRadius: 10, padding: "12px 8px 4px" }}>
                  <WeightChart data={weightLog} viewMode={chartView} />
                </div>
              </div>
            )}

            {/* Log entry input */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input type="number" placeholder="Enter weight (kg)" value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addWeight()}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
                  background: T.surface2, color: T.txtPrimary, fontSize: 13, outline: "none" }} />
              <button onClick={addWeight}
                style={{ padding: "10px 18px", borderRadius: 8, border: "none",
                  background: T.blue, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Log
              </button>
            </div>
            <p style={{ fontSize: 11, color: T.txtMuted, margin: "0 0 14px" }}>
              Log every Monday morning, before eating, after waking.
            </p>

            {/* Log history with edit / delete */}
            {weightLog.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.txtSecondary, margin: "0 0 8px" }}>
                  Log history
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6,
                  maxHeight: 260, overflowY: "auto" }}>
                  {[...weightLog].reverse().map((entry, ri) => {
                    const idx = weightLog.length - 1 - ri;
                    const isEditing = editingIdx === idx;
                    return (
                      <div key={idx} style={{ background: T.surface2, borderRadius: 8, padding: "8px 12px",
                        border: `1px solid ${isEditing ? T.blue + "66" : T.border}` }}>
                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <input type="date" value={editDate}
                                onChange={e => setEditDate(e.target.value)}
                                style={{ flex: 1, padding: "4px 8px", borderRadius: 6,
                                  border: `1px solid ${T.blue}`, background: T.surface3,
                                  color: T.txtPrimary, fontSize: 12, outline: "none", colorScheme: "dark" }} />
                              <input type="number" value={editValue} placeholder="kg"
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") saveEdit(idx); if (e.key === "Escape") { setEditingIdx(null); setEditDate(""); } }}
                                autoFocus
                                style={{ width: 70, padding: "4px 8px", borderRadius: 6,
                                  border: `1px solid ${T.blue}`, background: T.surface3,
                                  color: T.txtPrimary, fontSize: 13, outline: "none" }} />
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => saveEdit(idx)}
                                style={{ flex: 1, padding: "5px 0", borderRadius: 6, border: "none",
                                  background: T.blue, color: T.bg, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                Save
                              </button>
                              <button onClick={() => { setEditingIdx(null); setEditDate(""); }}
                                style={{ flex: 1, padding: "5px 0", borderRadius: 6, border: `1px solid ${T.border}`,
                                  background: "transparent", color: T.txtMuted, fontSize: 11, cursor: "pointer" }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: T.txtMuted, minWidth: 62 }}>{displayDate(entry.date)}</span>
                            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.txtPrimary }}>
                              {entry.kg} kg
                            </span>
                            <button onClick={() => startEdit(idx, entry.kg, entry.date)}
                              title="Edit"
                              style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
                                background: "transparent", color: T.txtMuted, fontSize: 13,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              ✏️
                            </button>
                            <button onClick={() => deleteWeight(idx)}
                              title="Delete"
                              style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
                                background: "transparent", color: T.red, fontSize: 13,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              🗑
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, margin: "0 0 4px" }}>
              Nutrition targets
            </p>
            <p style={{ fontSize: 12, color: T.txtSecondary, margin: "0 0 14px" }}>
              Reference — tracked in your separate meal plan dashboard
            </p>
            {[
              { label: "Calories", val: `${USER.calorieTarget} kcal/day`, color: T.txtPrimary },
              { label: "Protein", val: `≥${USER.proteinTarget}g/day`, color: T.blue },
              { label: "Carbs", val: `~${USER.carbTarget}g/day`, color: T.purple },
              { label: "Fat", val: `~${USER.fatTarget}g/day`, color: T.amber },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between",
                padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.txtSecondary }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.val}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      <p style={{ fontSize: 11, color: T.txtMuted, marginTop: 20, lineHeight: 1.6 }}>
        All data saved locally in your browser. Protein target based on 1.94g/kg (85 kg).
        Calorie deficit of ~400 kcal/day targets ~0.5–1 kg loss/month.
      </p>
    </div>
  );
}
