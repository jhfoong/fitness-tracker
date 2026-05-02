// workouts.js — all exercise data, schedules, and B-Bars optionals
// Single source of truth. Edit here to update across the whole app.

export const WARMUP = [
  { name: "Arm circles", reps: "10 fwd + 10 back", cue: "Stand tall, full range of motion. Loosens shoulders and upper back before any pushing or pulling." },
  { name: "Hip circles", reps: "10 each direction", cue: "Hands on hips, big slow circles. Wakes up hip joints that have been static from sitting." },
  { name: "Bodyweight squats", reps: "10 slow reps", cue: "Go slow, full depth. This is mobility work, not exercise. Pause at the bottom for 1 sec." },
  { name: "Leg swings", reps: "10 each leg (fwd/back + side/side)", cue: "Hold a wall for balance. Loosen hamstrings and hip flexors. Prevents the most common lower body injuries." },
];

export const EXERCISES = {
  // ── Push ────────────────────────────────────────────────────────────
  pushUps: {
    id: "pushUps", name: "Push-ups", tag: "Push", color: "#60a5fa",
    muscles: ["Chest", "Shoulders", "Triceps"],
    cue: "Hands shoulder-width, body rigid like a plank. Lower chest to 2cm off floor. Easier: knees down. Harder: feet elevated.",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4", channel: "Calisthenic Movement",
    progressions: ["Knee push-ups", "Full push-ups", "Decline push-ups", "Archer push-ups"],
  },
  wideGripPushUps: {
    id: "wideGripPushUps", name: "Wide-grip push-ups", tag: "Push", color: "#60a5fa",
    muscles: ["Chest", "Triceps"],
    cue: "Hands wider than shoulders. More chest stretch at bottom. Slower tempo = more time under tension. Great for upper chest.",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4", channel: "Calisthenic Movement",
  },
  pikePushUps: {
    id: "pikePushUps", name: "Pike push-ups", tag: "Shoulders", color: "#60a5fa",
    muscles: ["Shoulders", "Triceps", "Upper chest"],
    cue: "Form an inverted V. Lower crown of head toward floor, then push back up. The more vertical your torso, the harder it is.",
    video: "https://www.youtube.com/watch?v=DG-NcMnfZ_0", channel: "FitnessFAQs",
    progressions: ["Pike push-ups", "Decline push-ups", "Wall handstand push-ups"],
  },
  diamondPushUps: {
    id: "diamondPushUps", name: "Diamond push-ups", tag: "Triceps", color: "#60a5fa",
    muscles: ["Triceps", "Inner chest"],
    cue: "Hands form a diamond under chest. Elbows close to sides. Intense tricep focus. Drop to knees if needed.",
    video: "https://www.youtube.com/watch?v=J0DnG1_S92I", channel: "ScottHermanFitness",
  },
  // ── Pull ─────────────────────────────────────────────────────────────
  tableRows: {
    id: "tableRows", name: "Bodyweight rows (table)", tag: "Pull", color: "#f87171",
    muscles: ["Back", "Biceps", "Rear delts"],
    cue: "Lie under a sturdy table. Grip the edge, pull chest up to table. Keep body straight. Harder: elevate feet on a chair.",
    video: "https://www.youtube.com/watch?v=rloXYB8M3vU", channel: "Antranik",
  },
  // ── Legs ─────────────────────────────────────────────────────────────
  squats: {
    id: "squats", name: "Bodyweight squats", tag: "Legs", color: "#34d399",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    cue: "Feet hip-width, toes slightly out. Sit back into the squat, knees tracking toes. Drive through heels to stand. Keep chest up.",
    video: "https://www.youtube.com/watch?v=aclHkVaku9U", channel: "Bowflex",
  },
  jumpSquats: {
    id: "jumpSquats", name: "Jump squats", tag: "Legs + Cardio", color: "#34d399",
    muscles: ["Quads", "Glutes", "Calves", "Cardio"],
    cue: "Squat down to parallel, explode up, land softly with bent knees. Main calorie-burner. Omit if knees are sore.",
    video: "https://www.youtube.com/watch?v=CVaEhXotL7M", channel: "Howcast",
  },
  bulgarianSplitSquat: {
    id: "bulgarianSplitSquat", name: "Bulgarian split squats", tag: "Legs", color: "#34d399",
    muscles: ["Quads", "Glutes", "Balance"],
    cue: "Back foot on chair/couch. Front foot forward. Lower back knee toward floor. Hardest leg exercise here — take your time.",
    video: "https://www.youtube.com/watch?v=2C-uNgKwPLE", channel: "ScottHermanFitness",
  },
  reverseLunges: {
    id: "reverseLunges", name: "Reverse lunges", tag: "Legs", color: "#34d399",
    muscles: ["Quads", "Glutes", "Balance"],
    cue: "Step backward, lower back knee to 2cm off floor. Front thigh parallel. Push off front foot to return. Alternate legs.",
    video: "https://www.youtube.com/watch?v=xrPteyQLGAo", channel: "PureGym",
  },
  singleLegRDL: {
    id: "singleLegRDL", name: "Single-leg Romanian deadlift", tag: "Hinge", color: "#34d399",
    muscles: ["Hamstrings", "Glutes", "Lower back"],
    cue: "Stand on one leg, hinge forward from the hip keeping a flat back, let the other leg float behind you. Feel the stretch in your hamstring. Use a wall for balance at first. This is the missing movement pattern for your lower back health.",
    video: "https://www.youtube.com/watch?v=Zfr6wizR8rs", channel: "Squat University",
  },
  gluteBridges: {
    id: "gluteBridges", name: "Glute bridges", tag: "Glutes", color: "#34d399",
    muscles: ["Glutes", "Hamstrings", "Lower back"],
    cue: "Lie on back, feet flat, knees bent. Drive hips up until body is a straight line. Squeeze glutes at top for 1 sec. Lower slowly.",
    video: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E", channel: "Airrosti",
  },
  // ── Core ─────────────────────────────────────────────────────────────
  plank: {
    id: "plank", name: "Plank hold", tag: "Core", color: "#a78bfa",
    muscles: ["Core", "Shoulders", "Glutes"],
    cue: "Elbows under shoulders. Squeeze abs, glutes, quads — whole body tight. Breathe normally. Stop when hips sag.",
    video: "https://www.youtube.com/watch?v=pSHjTRCQxIw", channel: "ScottHermanFitness",
    progressions: ["Forearm plank", "Full plank", "RKC plank", "Plank with shoulder taps"],
  },
  hollowBody: {
    id: "hollowBody", name: "Hollow body hold", tag: "Core", color: "#a78bfa",
    muscles: ["Deep core", "Hip flexors"],
    cue: "Lie on back, press lower back into floor. Arms overhead, legs raised to 30°. Entire lower back stays flat. Toughest core move here.",
    video: "https://www.youtube.com/watch?v=LlDNef_Ztsc", channel: "FitnessFAQs",
  },
  mountainClimbers: {
    id: "mountainClimbers", name: "Mountain climbers", tag: "Core + Cardio", color: "#a78bfa",
    muscles: ["Core", "Shoulders", "Cardio"],
    cue: "Plank position, drive knees toward chest alternating fast. Keep hips down. Doubles as cardio. Rest 90 sec between sets.",
    video: "https://www.youtube.com/watch?v=nmwgirgXLYM", channel: "Howcast",
  },
};

// ── B-Bars optional exercises ────────────────────────────────────────────────

export const BBARS = {
  chinUps: {
    id: "chinUps", name: "Chin-ups / assisted", tag: "B-Bars", color: "#f87171",
    barHeight: "High bar · 129cm",
    sets: "2–3 reps", freq: "Multiple times/day",
    muscles: ["Back", "Biceps", "Core"],
    cue: "Underhand grip is easiest to start. Jump up and lower yourself slowly if you can't do a full rep. Even 1–2 slow negatives counts.",
    video: "https://www.youtube.com/watch?v=eGo4IYlbE5g", channel: "Calisthenic Movement",
  },
  dips: {
    id: "dips", name: "Parallel bar dips", tag: "B-Bars", color: "#60a5fa",
    barHeight: "Low bar · 91cm",
    sets: "3–5 reps", freq: "Multiple times/day",
    muscles: ["Chest", "Triceps", "Shoulders"],
    cue: "Lower until elbows hit 90°. Torso slightly forward = more chest. Upright = more triceps. Feet-assisted (toes on floor) if needed.",
    video: "https://www.youtube.com/watch?v=2z8JmcrW-As", channel: "Calisthenic Movement",
  },
  deadHang: {
    id: "deadHang", name: "Dead hang", tag: "B-Bars", color: "#34d399",
    barHeight: "High bar · 129cm",
    sets: "20–40 sec", freq: "Once per hour minimum",
    muscles: ["Grip", "Spine decompression", "Lats"],
    cue: "Just hang. Fully passive, shoulders relaxed. Decompresses spine after sitting. Do it every time you walk past the bars.",
    video: "https://www.youtube.com/watch?v=PlAE67ovNEo", channel: "Gymless",
  },
  scapularPulls: {
    id: "scapularPulls", name: "Scapular pulls", tag: "B-Bars", color: "#f87171",
    barHeight: "High bar · 129cm",
    sets: "5–8 reps", freq: "2–3x/day",
    muscles: ["Rotator cuff", "Lats", "Scapular stabilisers"],
    cue: "Hang from the high bar, arms straight. Without bending elbows, depress shoulder blades down — body rises 2–3cm. Hold 1 sec, release. Zero fatigue, massive shoulder health benefit.",
    video: "https://www.youtube.com/watch?v=pE8PJsWEV7k", channel: "Functional Bodybuilding",
  },
  deepSquatHold: {
    id: "deepSquatHold", name: "Bar-assisted deep squat hold", tag: "B-Bars", color: "#34d399",
    barHeight: "Low bar · 91cm",
    sets: "30–60 sec", freq: "2–3x/day",
    muscles: ["Hip flexors", "Ankles", "Glutes"],
    cue: "Hold bars for balance, drop into a full deep squat. Great hip flexor and ankle opener. Perfect after sitting for hours. Purely mobility.",
    video: "https://www.youtube.com/watch?v=0wzrgyAurT8", channel: "Strength Side",
  },
  lSitTuck: {
    id: "lSitTuck", name: "L-sit holds (tuck)", tag: "B-Bars", color: "#a78bfa",
    barHeight: "Low bar · 91cm",
    sets: "3–5 sec", freq: "A few times/day",
    muscles: ["Core", "Hip flexors", "Triceps"],
    cue: "Support yourself on the low bars. Tuck knees up toward chest and hold. Even 3 seconds is hard at first. Builds serious core and hip flexor strength.",
    video: "https://www.youtube.com/watch?v=IUZJoSP66HI", channel: "Antranik",
  },
  hangingKneeRaises: {
    id: "hangingKneeRaises", name: "Hanging knee raises", tag: "B-Bars", color: "#a78bfa",
    barHeight: "High bar · 129cm",
    sets: "5–8 reps", freq: "Multiple times/day",
    muscles: ["Lower abs", "Hip flexors", "Grip"],
    cue: "Hang from high bar, pull knees up to chest, lower slowly. Far more effective than floor crunches. Keep swing minimal.",
    video: "https://www.youtube.com/watch?v=hdng3Nm1x_E", channel: "ScottHermanFitness",
  },
};

// ── Session definitions ──────────────────────────────────────────────────────
// Each workout type has an A and B variant that rotate every 2 weeks.
// A = push/squat/glute emphasis  |  B = wide/explosive/hinge emphasis

export const SESSIONS = {

  // ── Busy week — Full body ─────────────────────────────────────────────────
  busyFullBody_A: {
    id: "busyFullBody_A", label: "Full body", variant: "A", color: "#60a5fa",
    exercises: [
      { ...EXERCISES.pushUps,       sets: 3, repsLabel: "8–12 reps" },
      { ...EXERCISES.squats,        sets: 3, repsLabel: "12–15 reps" },
      { ...EXERCISES.gluteBridges,  sets: 3, repsLabel: "15–20 reps" },
      { ...EXERCISES.pikePushUps,   sets: 3, repsLabel: "6–10 reps" },
      { ...EXERCISES.reverseLunges, sets: 3, repsLabel: "10 each leg" },
      { ...EXERCISES.plank,         sets: 3, repsLabel: "20–40 sec" },
    ],
    bbars: [BBARS.chinUps, BBARS.dips, BBARS.deadHang],
  },
  busyFullBody_B: {
    id: "busyFullBody_B", label: "Full body", variant: "B", color: "#60a5fa",
    exercises: [
      { ...EXERCISES.wideGripPushUps,    sets: 3, repsLabel: "8–12 reps" },
      { ...EXERCISES.jumpSquats,         sets: 3, repsLabel: "12–15 reps" },
      { ...EXERCISES.bulgarianSplitSquat,sets: 3, repsLabel: "10 each leg" },
      { ...EXERCISES.diamondPushUps,     sets: 3, repsLabel: "6–10 reps" },
      { ...EXERCISES.singleLegRDL,       sets: 3, repsLabel: "8 each leg" },
      { ...EXERCISES.hollowBody,         sets: 3, repsLabel: "20–30 sec" },
    ],
    bbars: [BBARS.chinUps, BBARS.dips, BBARS.deadHang],
  },

  // ── Busy week — Optional Saturday (lighter, no guilt if skipped) ──────────
  busyOptional_A: {
    id: "busyOptional_A", label: "Bonus session", variant: "A", color: "#f59e0b", optional: true,
    exercises: [
      { ...EXERCISES.pushUps,      sets: 2, repsLabel: "8–10 reps" },
      { ...EXERCISES.squats,       sets: 2, repsLabel: "10–12 reps" },
      { ...EXERCISES.gluteBridges, sets: 2, repsLabel: "12–15 reps" },
    ],
    bbars: [BBARS.deadHang, BBARS.deepSquatHold],
  },
  busyOptional_B: {
    id: "busyOptional_B", label: "Bonus session", variant: "B", color: "#f59e0b", optional: true,
    exercises: [
      { ...EXERCISES.wideGripPushUps, sets: 2, repsLabel: "8–10 reps" },
      { ...EXERCISES.reverseLunges,   sets: 2, repsLabel: "8 each leg" },
      { ...EXERCISES.plank,           sets: 2, repsLabel: "20–30 sec" },
    ],
    bbars: [BBARS.deadHang, BBARS.deepSquatHold],
  },

  // ── Regular week — Upper body ─────────────────────────────────────────────
  regularUpper_A: {
    id: "regularUpper_A", label: "Upper body", variant: "A", color: "#60a5fa",
    exercises: [
      { ...EXERCISES.pushUps,         sets: 4, repsLabel: "10–15 reps" },
      { ...EXERCISES.wideGripPushUps, sets: 3, repsLabel: "8–12 reps" },
      { ...EXERCISES.pikePushUps,     sets: 4, repsLabel: "8–12 reps" },
      { ...EXERCISES.tableRows,       sets: 4, repsLabel: "10–12 reps" },
      { ...EXERCISES.diamondPushUps,  sets: 3, repsLabel: "6–10 reps" },
    ],
    bbars: [BBARS.dips, BBARS.scapularPulls, BBARS.chinUps],
  },
  regularUpper_B: {
    id: "regularUpper_B", label: "Upper body", variant: "B", color: "#60a5fa",
    exercises: [
      { ...EXERCISES.pikePushUps,     sets: 4, repsLabel: "8–12 reps" },  // shoulders fresh
      { ...EXERCISES.tableRows,       sets: 4, repsLabel: "10–12 reps" },
      { ...EXERCISES.diamondPushUps,  sets: 4, repsLabel: "6–10 reps" },
      { ...EXERCISES.pushUps,         sets: 3, repsLabel: "10–15 reps" },
      { ...EXERCISES.wideGripPushUps, sets: 3, repsLabel: "8–12 reps" },
    ],
    bbars: [BBARS.scapularPulls, BBARS.chinUps, BBARS.dips],
  },

  // ── Regular week — Lower body ─────────────────────────────────────────────
  regularLower_A: {
    id: "regularLower_A", label: "Lower body", variant: "A", color: "#34d399",
    exercises: [
      { ...EXERCISES.jumpSquats,          sets: 4, repsLabel: "12–15 reps" },
      { ...EXERCISES.bulgarianSplitSquat, sets: 3, repsLabel: "10 each leg" },
      { ...EXERCISES.gluteBridges,        sets: 3, repsLabel: "15–20 reps" },
      { ...EXERCISES.reverseLunges,       sets: 3, repsLabel: "10 each leg" },
      { ...EXERCISES.singleLegRDL,        sets: 3, repsLabel: "8 each leg" },
    ],
    bbars: [BBARS.deepSquatHold, BBARS.lSitTuck, BBARS.deadHang],
  },
  regularLower_B: {
    id: "regularLower_B", label: "Lower body", variant: "B", color: "#34d399",
    exercises: [
      { ...EXERCISES.singleLegRDL,        sets: 4, repsLabel: "8 each leg" },  // hinge first
      { ...EXERCISES.bulgarianSplitSquat, sets: 4, repsLabel: "10 each leg" },
      { ...EXERCISES.squats,              sets: 3, repsLabel: "12–15 reps (3-sec descent)" },
      { ...EXERCISES.gluteBridges,        sets: 3, repsLabel: "15–20 reps" },
      { ...EXERCISES.reverseLunges,       sets: 3, repsLabel: "10 each leg" },
    ],
    bbars: [BBARS.lSitTuck, BBARS.deepSquatHold, BBARS.deadHang],
  },

  // ── Regular week — Core + cardio ──────────────────────────────────────────
  regularCore_A: {
    id: "regularCore_A", label: "Core + cardio", variant: "A", color: "#a78bfa",
    exercises: [
      { ...EXERCISES.plank,            sets: 4, repsLabel: "30–60 sec" },
      { ...EXERCISES.hollowBody,       sets: 3, repsLabel: "20–30 sec" },
      { ...EXERCISES.mountainClimbers, sets: 3, repsLabel: "20 each leg" },
    ],
    bbars: [BBARS.hangingKneeRaises, BBARS.deadHang],
  },
  regularCore_B: {
    id: "regularCore_B", label: "Core + cardio", variant: "B", color: "#a78bfa",
    exercises: [
      { ...EXERCISES.mountainClimbers, sets: 4, repsLabel: "20 each leg" },  // cardio first
      { ...EXERCISES.hollowBody,       sets: 4, repsLabel: "20–30 sec" },
      { ...EXERCISES.plank,            sets: 3, repsLabel: "30–60 sec" },
    ],
    bbars: [BBARS.deadHang, BBARS.hangingKneeRaises],
  },

  // ── Regular week — Full body (Fri) ────────────────────────────────────────
  regularFullBody_A: {
    id: "regularFullBody_A", label: "Full body", variant: "A", color: "#f59e0b",
    exercises: [
      { ...EXERCISES.pushUps,       sets: 4, repsLabel: "10–15 reps" },
      { ...EXERCISES.squats,        sets: 4, repsLabel: "12–15 reps" },
      { ...EXERCISES.gluteBridges,  sets: 4, repsLabel: "15–20 reps" },
      { ...EXERCISES.pikePushUps,   sets: 4, repsLabel: "8–12 reps" },
      { ...EXERCISES.reverseLunges, sets: 4, repsLabel: "10 each leg" },
      { ...EXERCISES.plank,         sets: 4, repsLabel: "30–60 sec" },
    ],
    bbars: [BBARS.chinUps, BBARS.dips, BBARS.deadHang],
  },
  regularFullBody_B: {
    id: "regularFullBody_B", label: "Full body", variant: "B", color: "#f59e0b",
    exercises: [
      { ...EXERCISES.wideGripPushUps,    sets: 4, repsLabel: "8–12 reps" },
      { ...EXERCISES.jumpSquats,         sets: 4, repsLabel: "12–15 reps" },
      { ...EXERCISES.bulgarianSplitSquat,sets: 4, repsLabel: "10 each leg" },
      { ...EXERCISES.diamondPushUps,     sets: 4, repsLabel: "6–10 reps" },
      { ...EXERCISES.singleLegRDL,       sets: 4, repsLabel: "8 each leg" },
      { ...EXERCISES.hollowBody,         sets: 4, repsLabel: "20–30 sec" },
    ],
    bbars: [BBARS.dips, BBARS.chinUps, BBARS.deadHang],
  },

  // ── Regular week — Optional Saturday ─────────────────────────────────────
  regularOptional_A: {
    id: "regularOptional_A", label: "Bonus session", variant: "A", color: "#f59e0b", optional: true,
    exercises: [
      { ...EXERCISES.pushUps, sets: 3, repsLabel: "8–12 reps" },
      { ...EXERCISES.squats,  sets: 3, repsLabel: "12–15 reps" },
      { ...EXERCISES.plank,   sets: 3, repsLabel: "20–30 sec" },
    ],
    bbars: [BBARS.deadHang, BBARS.deepSquatHold],
  },
  regularOptional_B: {
    id: "regularOptional_B", label: "Bonus session", variant: "B", color: "#f59e0b", optional: true,
    exercises: [
      { ...EXERCISES.wideGripPushUps, sets: 3, repsLabel: "8–12 reps" },
      { ...EXERCISES.gluteBridges,    sets: 3, repsLabel: "15–20 reps" },
      { ...EXERCISES.mountainClimbers,sets: 3, repsLabel: "15 each leg" },
    ],
    bbars: [BBARS.deadHang, BBARS.deepSquatHold],
  },

  // ── Rest ──────────────────────────────────────────────────────────────────
  rest: {
    id: "rest", label: "Rest", color: "#6b7492",
    exercises: [],
    bbars: [BBARS.deadHang, BBARS.deepSquatHold],
  },
};

// ── 2-week variant rotation ──────────────────────────────────────────────────
// Returns "A" for weeks 1-2, 5-6, 9-10... and "B" for weeks 3-4, 7-8, 11-12...
export function getWeekVariant() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return Math.floor((weekNum - 1) / 2) % 2 === 0 ? "A" : "B";
}

// Resolve the active session for a schedule day given the current variant
export function resolveSession(schedDay, variant) {
  if (!schedDay) return SESSIONS.rest;
  if (schedDay.sessionA && schedDay.sessionB) {
    return variant === "A" ? schedDay.sessionA : schedDay.sessionB;
  }
  return schedDay.session || SESSIONS.rest;
}

// ── Weekly schedule map ──────────────────────────────────────────────────────
// sessionA / sessionB auto-rotate every 2 weeks via getWeekVariant()
// optional: true = weekend bonus session (skip without guilt — do Sat OR Sun, not both)

export const WEEKLY_SCHEDULE = {
  busy: {
    Mon: { sessionA: SESSIONS.busyFullBody_A, sessionB: SESSIONS.busyFullBody_B, note: "" },
    Tue: { session: SESSIONS.rest, note: "Meal prep — mid-week batch" },
    Wed: { sessionA: SESSIONS.busyFullBody_A, sessionB: SESSIONS.busyFullBody_B, note: "" },
    Thu: { session: SESSIONS.rest, note: "" },
    Fri: { sessionA: SESSIONS.busyFullBody_A, sessionB: SESSIONS.busyFullBody_B, note: "" },
    Sat: { sessionA: SESSIONS.busyOptional_A, sessionB: SESSIONS.busyOptional_B, note: "Optional — do Sat or Sun, not both", optional: true },
    Sun: { sessionA: SESSIONS.busyOptional_A, sessionB: SESSIONS.busyOptional_B, note: "Optional · meal prep day — do Sat or Sun, not both", optional: true },
  },
  regular: {
    Mon: { sessionA: SESSIONS.regularUpper_A,    sessionB: SESSIONS.regularUpper_B,    note: "" },
    Tue: { sessionA: SESSIONS.regularLower_A,    sessionB: SESSIONS.regularLower_B,    note: "" },
    Wed: { session: SESSIONS.rest, note: "Meal prep — mid-week batch" },
    Thu: { sessionA: SESSIONS.regularCore_A,     sessionB: SESSIONS.regularCore_B,     note: "" },
    Fri: { sessionA: SESSIONS.regularFullBody_A, sessionB: SESSIONS.regularFullBody_B, note: "" },
    Sat: { sessionA: SESSIONS.regularOptional_A, sessionB: SESSIONS.regularOptional_B, note: "Optional — do Sat or Sun, not both", optional: true },
    Sun: { sessionA: SESSIONS.regularOptional_A, sessionB: SESSIONS.regularOptional_B, note: "Optional · meal prep day — do Sat or Sun, not both", optional: true },
  },
};

export const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
