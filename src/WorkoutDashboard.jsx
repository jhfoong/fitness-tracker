import { useState, useEffect, useRef } from "react";

// ─── Data imports ────────────────────────────────────────────────────────────
import { WARMUP, SESSIONS, WEEKLY_SCHEDULE, DAY_ORDER } from "./data/workouts";
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

function fmt(n) { return Math.round(n).toLocaleString(); }

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
  const today = getTodayKey();
  const todaySchedule = WEEKLY_SCHEDULE[weekMode][today];
  const todaySession = todaySchedule?.session;
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

  function toggleHabit(id) {
    const key = `${today}_${id}`;
    setHabitLog(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function habitDone(id) {
    return !!habitLog[`${today}_${id}`];
  }

  function addWeight() {
    const w = parseFloat(newWeight);
    if (!w || w < 40 || w > 200) return;
    setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString("en-AU"), kg: w }]);
    setNewWeight("");
  }

  const sessionExercises = todaySession?.exercises || [];
  const sessionBbars = todaySession?.bbars || [];
  const doneCount = sessionExercises.filter(ex => getCompleted(ex.id) >= (ex.sets || 3)).length;
  const sessionComplete = sessionExercises.length > 0 && doneCount === sessionExercises.length;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "1.5rem",
      fontFamily: "system-ui, sans-serif", color: T.txtPrimary, boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: T.txtPrimary }}>
          Fitness tracker
        </h1>
        <p style={{ fontSize: 13, color: T.txtSecondary, margin: 0 }}>
          85 kg · 170 cm · male · mid-30s · goal: −10 kg + maintain muscle
        </p>
      </div>

      {/* Week mode toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { key: "busy", label: "Busy week", sub: "3 days · full body" },
          { key: "regular", label: "Regular week", sub: "5 days · split" },
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
                <p style={{ fontSize: 11, color: T.txtMuted, margin: "0 0 4px" }}>
                  {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, color: todaySession?.color || T.txtMuted, margin: "0 0 4px" }}>
                  {isRestDay ? "Rest day" : todaySession?.label}
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

          {/* B-Bars optionals */}
          {sessionBbars.length > 0 && (
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
                Dead hang = once per hour minimum.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessionBbars.map(ex => (
                  <ExerciseCard key={ex.id} ex={ex} isOptional />
                ))}
              </div>
            </div>
          )}

          {isRestDay && (
            <Card>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.txtPrimary, marginBottom: 8 }}>
                Active rest day
              </p>
              <p style={{ fontSize: 13, color: T.txtSecondary, lineHeight: 1.7, marginBottom: 14 }}>
                Take a 20–30 min walk. End with the 10-min stretch routine if it's one of your stretch days.
                B-Bars dead hangs are perfect today — no recovery cost, huge spine benefit.
              </p>
              {sessionBbars.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {sessionBbars.map(ex => (
                    <ExerciseCard key={ex.id} ex={ex} isOptional />
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* ── WEEK TAB ──────────────────────────────────────────────────────── */}
      {tab === "week" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 8, marginBottom: 20 }}>
            {DAY_ORDER.map(day => {
              const sched = WEEKLY_SCHEDULE[weekMode][day];
              const sess = sched?.session;
              const isToday = day === today;
              const isRest = !sess?.exercises?.length;
              return (
                <div key={day} style={{ borderRadius: 10, padding: "10px 6px", textAlign: "center",
                  border: `${isToday ? "2px" : "1px"} solid ${isToday ? sess?.color || T.border : T.border}`,
                  background: isToday ? (sess?.color || T.txtMuted) + "22" : T.surface,
                  opacity: isRest && !isToday ? 0.5 : 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: sess?.color || T.txtMuted, marginBottom: 4 }}>
                    {day}
                  </div>
                  <div style={{ fontSize: 9, color: sess?.color || T.txtMuted, opacity: 0.85, lineHeight: 1.4 }}>
                    {isRest ? "Rest" : sess?.label}
                  </div>
                </div>
              );
            })}
          </div>

          {DAY_ORDER.map(day => {
            const sched = WEEKLY_SCHEDULE[weekMode][day];
            const sess = sched?.session;
            const isRest = !sess?.exercises?.length;
            return (
              <Card key={day} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isRest ? 0 : 10 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: sess?.color || T.txtMuted }}>{day} — </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.txtPrimary }}>
                      {isRest ? "Rest" : sess?.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: T.txtMuted }}>{sched?.note}</span>
                </div>
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
              {DAILY_HABITS.map(h => {
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

            {weightLog.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {/* Simple sparkline */}
                <div style={{ background: T.surface2, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                  {weightLog.slice(-8).map((entry, i) => {
                    const pct = Math.min(100, Math.max(0, ((entry.kg - USER.goalWeightKg) / (USER.weightKg - USER.goalWeightKg)) * 100));
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: T.txtMuted, width: 60, flexShrink: 0 }}>{entry.date}</span>
                        <div style={{ flex: 1, background: T.surface3, borderRadius: 4, height: 8 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: T.blue,
                            borderRadius: 4, transition: "width 0.4s" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: T.txtPrimary, width: 50, textAlign: "right" }}>
                          {entry.kg} kg
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
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
            <p style={{ fontSize: 11, color: T.txtMuted, marginTop: 8 }}>
              Log every Monday morning, before eating, after waking.
            </p>
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
