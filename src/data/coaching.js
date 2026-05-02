// coaching.js — holistic system data: pillars, habits, stretch, roadmap

export const USER = {
  weightKg: 85,
  goalWeightKg: 75,
  heightCm: 170,
  proteinTarget: 165,
  calorieTarget: 2100,
  carbTarget: 180,
  fatTarget: 55,
};

export const PILLARS = [
  {
    id: "training", label: "Training", status: "covered", color: "#60a5fa", statusBg: "#1e3a5f",
    rules: [
      "3–5 sessions/week, bodyweight + B-Bars",
      "Always warm up — 3 min before every session",
      "Greasing the groove with B-Bars during work hours",
      "Progress every 1–2 weeks, not every session",
      "Soreness 3+ days = reduce volume next session",
    ],
  },
  {
    id: "nutrition", label: "Nutrition", status: "covered", color: "#34d399", statusBg: "#0a2a1a",
    rules: [
      "2,100 kcal/day · 165g+ protein — non-negotiable",
      "Meal plan dashboard already built",
      "Front-load protein early in the day",
      "Don't stress evening events — you've planned for them",
      "Drink 500ml water on waking before coffee",
    ],
  },
  {
    id: "sleep", label: "Sleep", status: "needs focus", color: "#a78bfa", statusBg: "#1a1040",
    rules: [
      "Target 7–8 hours — non-negotiable for fat loss",
      "Same bedtime every night ±30 min, including weekends",
      "No screens 30 min before bed — single biggest lever",
      "Keep room cool and dark",
      "Poor sleep raises cortisol → fat storage + muscle breakdown",
    ],
  },
  {
    id: "recovery", label: "Recovery", status: "needs focus", color: "#f59e0b", statusBg: "#2a1a0a",
    rules: [
      "Rest days are part of training — don't skip them",
      "Weekly 10-min stretch session — see stretch guide",
      "Daily walks = active recovery, not just cardio",
      "Cold shower after workouts reduces inflammation",
      "Soreness for 2 days = normal. 3+ days = reduce volume",
    ],
  },
  {
    id: "mindset", label: "Stress + mindset", status: "easy to overlook", color: "#f87171", statusBg: "#1a0a0a",
    rules: [
      "Chronic stress (cortisol) causes belly fat storage at 35+",
      "Workouts are one of the best cortisol reducers — use them that way",
      "5 min slow breathing after sessions (4-sec in, 6-sec out)",
      "Progress photos every 4 weeks — the scale lies week-to-week",
      "Miss a day or meal? Move on. Consistency over 12 weeks beats perfection",
    ],
  },
];

export const DAILY_HABITS = [
  {
    id: "water", time: "On waking", color: "#a78bfa",
    name: "Drink 500ml water before anything else",
    why: "You wake up dehydrated after 7–8 hours. Hydration affects energy, hunger signals, and metabolism. Do this before coffee — takes 30 seconds.",
  },
  {
    id: "session", time: "Morning (workout days)", color: "#60a5fa",
    name: "Complete your session — warm-up included",
    why: "3-min warm-up + main session + B-Bars throughout the day. Non-negotiable on scheduled days. On rest days, replace with a 20-min walk.",
  },
  {
    id: "protein", time: "All day", color: "#34d399",
    name: "Hit your protein target (165g+)",
    why: "Protein is your single most important number. Everything else — calories, carbs, fat — can flex. Protein does not flex. Your meal plan makes this automatic.",
  },
  {
    id: "deadhang", time: "During work hours", color: "#f59e0b",
    name: "B-Bars dead hang 3–5× a day",
    why: "Aim for 3–5 hangs spread across the day — morning, before/after lunch, and late afternoon works well. 20–30 seconds each. Posture reset, spine decompressor, and grip builder in one. You'll feel the difference within a week.",
  },
  {
    id: "screens", time: "Evening", color: "#f87171",
    name: "No screens 30 minutes before bed",
    why: "Blue light suppresses melatonin for up to 2 hours. Poor sleep = elevated cortisol = fat storage and muscle breakdown. This one habit improves everything downstream.",
  },
  {
    id: "weighin", time: "Weekly (Monday)", color: "#38bdf8",
    name: "Weigh yourself once — same day, same time",
    why: "Monday morning, after waking, before eating. Log it. Don't weigh daily — fluctuations of 1–2 kg are normal (water, food, hormones) and will mess with your head. Weekly gives the true trend.",
  },
];

export const STRETCH_ROUTINE = [
  {
    id: "hipFlexor", name: "Hip flexor stretch (kneeling lunge)",
    duration: "90 sec each side", color: "#a78bfa",
    cue: "Kneel on one knee, push hips forward gently until you feel the front of the back hip stretching. This is the #1 stretch for desk workers — hip flexors are shortened all day and this directly counteracts that. Tilt pelvis under slightly to intensify.",
    target: "Hip flexors shortened from sitting",
  },
  {
    id: "thoracic", name: "Thoracic spine rotation",
    duration: "10 reps each side", color: "#60a5fa",
    cue: "Sit cross-legged or lie on your side with knees stacked. Rotate your upper body as far as comfortable, opening the chest. Your mid-back locks up from sitting forward all day — this directly reverses it. Critical for shoulder health and posture.",
    target: "Mid-back locked from sitting forward",
  },
  {
    id: "hamstring", name: "Standing hamstring stretch",
    duration: "60 sec each side", color: "#34d399",
    cue: "One foot on a step or low surface, hinge forward from the hips keeping a flat back. Tight hamstrings pull on the lower back and cause the low back pain that's almost universal in desk workers. 60 sec each side consistently for 4 weeks makes a noticeable difference.",
    target: "Tight hamstrings pulling on lower back",
  },
  {
    id: "chest", name: "Chest and shoulder opener (doorway)",
    duration: "60 sec hold", color: "#f59e0b",
    cue: "Stand in a doorway, arms at 90 degrees on the frame, step forward gently until you feel a stretch across the chest. Sitting at a desk constantly pulls shoulders forward — this is the antidote. Counteracts internal rotation that causes shoulder impingement over time.",
    target: "Shoulders rounded forward from desk posture",
  },
  {
    id: "childsPose", name: "Child's pose with side reach",
    duration: "60 sec each side", color: "#f87171",
    cue: "Kneel and reach arms forward, then walk hands to one side. Opens the lat, shoulder, and side of the torso — areas that compress during push-heavy training. Perfect cooldown move after any workout too.",
    target: "Lats and shoulders compressed from push training",
  },
];

export const ROADMAP = [
  {
    month: 1, label: "Build the foundation", color: "#34d399", bg: "#0a2a1a",
    focus: "Habit first. Performance second.",
    description: "Just show up. Your only job in month 1 is to complete every scheduled session and follow your meal plan 80% of the time. Don't chase intensity — chase consistency. Start on the busy week (3 days) even if you have time for more. Form habits before adding load.",
    tags: ["3 sessions/week", "Follow meal plan 80%", "Daily water + weigh-in", "Start dead hang habit"],
  },
  {
    month: 2, label: "Add intensity", color: "#60a5fa", bg: "#1e3a5f",
    focus: "Upgrade reps, upgrade variations.",
    description: "Now that showing up is automatic, add quality. Move to the regular week plan (5 days) if you're ready. Add the weekly stretch session. Start logging your B-Bars sets. Add the no-screens bedtime habit. Visible changes start around week 6–8.",
    tags: ["Upgrade to 5 days if ready", "Add weekly stretch", "Add hip hinge (RDL)", "No screens before bed"],
  },
  {
    month: 3, label: "Dial in and measure", color: "#a78bfa", bg: "#1a1040",
    focus: "All 5 pillars running. Review and optimise.",
    description: "By month 3 the system is running. Take progress photos and compare to week 1. Log your weight trend — you should be down 2–4 kg if nutrition has been consistent. Upgrade exercise variations that feel easy. Think about fine-tuning — this is when we get specific again.",
    tags: ["Progress photos + measurements", "Upgrade exercise variations", "Second stretch session", "Review and fine-tune"],
  },
];

export const PROGRAM_TWEAKS = [
  {
    id: "warmup", priority: 1, color: "#fbbf24",
    title: "Add a warm-up — 3 minutes before every session",
    body: "At 35+ with a sedentary job, cold joints are an injury risk. Three minutes of arm circles, hip circles, bodyweight squats, and leg swings changes everything. This is the first item in every session — non-negotiable.",
  },
  {
    id: "hiphinge", priority: 2, color: "#fbbf24",
    title: "Add a hip hinge on lower body days",
    body: "The lower body program was quad and glute dominant with no hinge pattern. Single-leg Romanian deadlifts train the hamstrings and lower back directly. Easy to learn, crucial for back health at a desk job.",
  },
  {
    id: "stretch", priority: 3, color: "#fbbf24",
    title: "One rest day walk ends with a 10-minute stretch",
    body: "Hip flexors and thoracic spine tighten fast from desk work. One of your weekly walks should end with the 5-stretch routine. At 35+ this isn't optional — it's what keeps the program sustainable for 12 months.",
  },
];
