# Fitness Tracker — Claude Code Context

This file contains everything Claude Code needs to know about the user, their goals,
and the full fitness + nutrition system we built together. Always read this file before
making changes or building new features.

---

## About the user

- **Sex:** Male
- **Age:** Mid-30s
- **Height:** 170 cm
- **Starting weight:** 85 kg
- **Goal weight:** 75 kg (first milestone, −10 kg over 6–12 months)
- **Job:** Tech, 9–5, sedentary (desk-based, mostly sitting)
- **Equipment:** Bodyweight only + BaseBlocks B-Bars (height-adjustable parallel bars)
  - Low setting: 91 cm — for dips, rows, L-sits, squat holds
  - High setting: 129 cm — for chin-ups, dead hangs, hanging knee raises, scapular pulls
- **Fitness level:** Beginner-intermediate, returning to training
- **Location:** Melbourne, Australia (Pepperstone, Collins St office)

---

## Overall goals

1. Lose 10 kg fat (85 → 75 kg) — first milestone, then reassess
2. Build or maintain muscle during the fat loss phase
3. Build consistent, sustainable habits — especially around a busy work life
4. Feel strong, energetic, and in control of health for the long term

---

## Nutrition targets

| Metric | Target |
|--------|--------|
| Calories | ~2,100 kcal/day (deficit ~400 kcal/day) |
| Protein | ≥165g/day (1.94g/kg at 85 kg) |
| Carbs | ~180g/day |
| Fat | ~55g/day |

### Three day-types (already built in meal_plan_dashboard.jsx)
- **Office day** — Pepperstone, Collins St. Portable meals, prep night before
- **WFH day** — Cook fresh, no packing needed
- **Evening event day** — Front-load protein, relax at dinner

### Weekly schedule
- Mon: Office (Anthropic course 5pm)
- Tue: Office
- Wed: Office
- Thu: Evening event (HeyTea + social 6pm)
- Fri: Evening event (Claude project 6pm)
- Sat: WFH / flexible
- Sun: WFH / meal prep day

### Key nutrition rules
- Protein is non-negotiable. Everything else can flex.
- Drink 500ml water on waking before coffee
- HeyTea visits (Thu/Fri mornings) ~150–250 kcal — skip afternoon crackers to compensate
- Don't stress evening events — protein is already front-loaded earlier in those days
- Adjust portions as weight moves toward 75 kg over time

---

## Workout system

### Two modes
| Mode | Days | Duration | Structure |
|------|------|----------|-----------|
| Busy week | 3 days (Mon/Wed/Fri) + optional Sat | ~30 min | Full body each session |
| Regular week | 4 days (Mon/Tue/Thu/Fri) + optional Sat | ~35 min | Split by muscle group |

### A/B exercise rotation
Exercises within each session rotate every 2 weeks to prevent adaptation and add variety.
`getWeekVariant()` in `workouts.js` returns `"A"` or `"B"` based on ISO week number (2-week cycle).
`resolveSession(schedDay, variant)` picks the correct session from `WEEKLY_SCHEDULE`.
- **Week A**: Standard exercise order (push-led upper, explosive lower, etc.)
- **Week B**: Alternative exercise order (shoulder-led upper, hinge-led lower, etc.)
The UI shows a "Week A" or "Week B" badge in the Today and Week tabs.

### Optional Saturday (both modes)
A lighter bonus session on Saturday — 2–3 sets per exercise, lower volume.
Only do this if energy is high. It's labelled "Optional" in amber in the UI and does not count as a core training day.
- **Busy Sat A**: Push-ups, Squats, Plank
- **Busy Sat B**: Wide Push-ups, Reverse Lunges, Mountain Climbers
- **Regular Sat A/B**: 3-set versions of the above

### Warm-up (ALWAYS — 3 min before every session)
Do these before touching the main workout. Non-negotiable at 35+ with a sedentary job.
- Arm circles — 10 forward, 10 backward
- Hip circles — 10 each direction
- Bodyweight squats — 10 slow reps
- Leg swings — 10 each leg (forward/back and side to side)

---

### Busy week — Full body (Mon/Wed/Fri)

| Exercise | Sets | Reps | Color | Muscles | Video |
|----------|------|------|-------|---------|-------|
| Push-ups | 3 | 8–12 | #60a5fa | Chest, Shoulders, Triceps | https://youtube.com/watch?v=IODxDxX7oi4 |
| Bodyweight squats | 3 | 12–15 | #34d399 | Quads, Glutes, Hamstrings | https://youtube.com/watch?v=aclHkVaku9U |
| Glute bridges | 3 | 15–20 | #34d399 | Glutes, Hamstrings, Lower back | https://youtube.com/watch?v=OUgsJ8-Vi0E |
| Pike push-ups | 3 | 6–10 | #60a5fa | Shoulders, Triceps, Upper chest | https://youtube.com/watch?v=PdnTvBqMPKk |
| Reverse lunges | 3 | 10 each | #34d399 | Quads, Glutes, Balance | https://youtube.com/watch?v=xrPteyQLGAo |
| Plank hold | 3 | 20–40 sec | #a78bfa | Core, Shoulders, Glutes | https://youtube.com/watch?v=pSHjTRCQxIw |

**B-Bars desk breaks (busy week):**
- Chin-ups / assisted — High bar 129cm — 2–3 reps, multiple times/day
- Parallel bar dips — Low bar 91cm — 3–5 reps, multiple times/day
- Dead hang — High bar 129cm — 20–40 sec, multiple times/day

---

### Regular week split

**Mon — Upper body**

| Exercise | Sets | Reps | Color | Muscles | Video |
|----------|------|------|-------|---------|-------|
| Push-ups | 4 | 10–15 | #60a5fa | Chest, Shoulders, Triceps | https://youtube.com/watch?v=IODxDxX7oi4 |
| Wide-grip push-ups | 3 | 8–12 | #60a5fa | Chest, Triceps | https://youtube.com/watch?v=IODxDxX7oi4 |
| Pike push-ups | 4 | 8–12 | #60a5fa | Shoulders, Triceps, Upper chest | https://youtube.com/watch?v=DG-NcMnfZ_0 |
| Bodyweight rows (table) | 4 | 10–12 | #f87171 | Back, Biceps, Rear delts | https://youtube.com/watch?v=rloXYB8M3vU |
| Diamond push-ups | 3 | 6–10 | #60a5fa | Triceps, Inner chest | https://youtube.com/watch?v=J0DnG1_S92I |

B-Bars: Parallel bar dips (low), Scapular pulls (high), Chin-ups (high)

**Tue — Lower body**

| Exercise | Sets | Reps | Color | Muscles | Video |
|----------|------|------|-------|---------|-------|
| Jump squats | 4 | 12–15 | #34d399 | Quads, Glutes, Calves, Cardio | https://youtube.com/watch?v=CVaEhXotL7M |
| Bulgarian split squats | 3 | 10 each | #34d399 | Quads, Glutes, Balance | https://youtube.com/watch?v=2C-uNgKwPLE |
| Glute bridges | 3 | 15–20 | #34d399 | Glutes, Hamstrings, Lower back | https://youtube.com/watch?v=OUgsJ8-Vi0E |
| Reverse lunges | 3 | 10 each | #34d399 | Quads, Glutes, Balance | https://youtube.com/watch?v=xrPteyQLGAo |
| Single-leg Romanian deadlift | 3 | 8 each | #34d399 | Hamstrings, Glutes, Lower back | https://youtube.com/watch?v=Zfr6wizR8rs |

B-Bars: Bar-assisted deep squat hold (low), L-sit tuck holds (low), Dead hang (high)

**Wed — Rest + meal prep (mid-week batch)**
B-Bars only: Dead hang (high), Bar-assisted deep squat hold (low)

**Thu — Core + cardio**

| Exercise | Sets | Reps | Color | Muscles | Video |
|----------|------|------|-------|---------|-------|
| Plank hold | 4 | 30–60 sec | #a78bfa | Core, Shoulders, Glutes | https://youtube.com/watch?v=pSHjTRCQxIw |
| Hollow body hold | 3 | 20–30 sec | #a78bfa | Deep core, Hip flexors | https://youtube.com/watch?v=LlDNef_Ztsc |
| Mountain climbers | 3 | 20 each leg | #a78bfa | Core, Shoulders, Cardio | https://youtube.com/watch?v=nmwgirgXLYM |

B-Bars: Hanging knee raises (high), Dead hang (high)

**Fri — Full body**
Same as busy week full body session but with 4 sets per exercise.

**Sat — Optional bonus session**
Lighter version (2–3 sets). Only if energy allows. B-Bars also fine.

**Sun — Rest**
B-Bars only: Dead hang (high), Bar-assisted deep squat hold (low)
Sun = main weekly meal prep day.

---

### Progression rules
- Week 1–2: Form focus. Easier variations OK. Just show up.
- Week 3–4: Add 1–2 reps per set per week
- Month 2+: Upgrade variations (knee push-ups → full → decline → archer)
- B-Bars "greasing the groove": always fresh, never fatigued, 2–5 reps scattered through the day
- Sore for 2 days = normal. Sore for 3+ days = reduce volume next session

---

## The 5 pillars (holistic system)

### 1. Training (covered)
Workout plan above. Always warm up. Add single-leg RDL to lower body days.

### 2. Nutrition (covered)
Meal plan dashboard exists. Protein is non-negotiable. Water on waking.

### 3. Sleep (needs focus)
- Target 7–8 hours — non-negotiable for fat loss
- Same bedtime every night ±30 min, including weekends
- No screens 30 min before bed — biggest single lever
- Poor sleep → elevated cortisol → fat storage and muscle breakdown

### 4. Recovery (needs focus)
- Rest days are part of training — don't skip
- Weekly 10-min stretch session (see below)
- Daily walks = active recovery, not just cardio
- Cold shower after workouts reduces inflammation
- Soreness 3+ days = reduce next session's volume

### 5. Stress + mindset
- Chronic stress (cortisol) causes belly fat storage — biggest silent enemy at 35+
- Workouts are one of the best cortisol reducers
- 5 min slow breathing after sessions (4-sec inhale, 6-sec exhale)
- Progress photos every 4 weeks — scale lies week-to-week
- Miss a day or meal? Move on. Consistency over 12 weeks > perfection over 2

---

## Weekly stretch routine (10 min, once per week minimum)

| Stretch | Duration | Target |
|---------|----------|--------|
| Hip flexor stretch (kneeling lunge) | 90 sec each side | Hip flexors shortened from sitting |
| Thoracic spine rotation | 10 reps each side | Mid-back locked from sitting forward |
| Standing hamstring stretch | 60 sec each side | Hamstrings tight → lower back pain |
| Chest and shoulder opener (doorway) | 60 sec | Counteracts desk-posture shoulder rounding |
| Child's pose with side reach | 60 sec each side | Lats + shoulder cooldown |

---

## Daily non-negotiables (6 habits only)

1. **On waking** — Drink 500ml water before anything else
2. **Morning (workout days)** — Complete session including warm-up
3. **All day** — Hit protein target (165g+)
4. **During work** — B-Bars dead hang once per hour (set a timer)
5. **Evening** — No screens 30 min before bed
6. **Weekly** — Weigh in Monday morning, same time, before eating

---

## 3-month roadmap

### Month 1 — Build the foundation
- Just show up. Consistency over intensity.
- Busy week (3 days) even if you have time for more
- Follow meal plan 80% of the time
- Add habits: morning water, weekly weigh-in, daily dead hangs
- Don't chase perfection

### Month 2 — Add intensity
- Move to regular week (5 days) if ready
- Add the weekly stretch session
- Add single-leg RDL to lower body days
- Add no-screens bedtime habit
- Visible changes start around week 6–8

### Month 3 — Dial in and measure
- All 5 pillars running
- Take progress photos, compare to week 1
- Should be down 2–4 kg if nutrition consistent
- Upgrade exercise variations
- Add second weekly stretch session
- Review and fine-tune

---

## Design system (match across all components)

```js
const THEME = {
  bg:           "#0f1117",
  surface:      "#1a1d27",
  surface2:     "#222534",
  surface3:     "#2a2d40",
  border:       "#2e3347",
  txtPrimary:   "#f0f2fa",
  txtSecondary: "#9aa3c2",
  txtMuted:     "#6b7492",
  blue:         "#60a5fa",   // push / upper body
  green:        "#34d399",   // legs / lower body
  purple:       "#a78bfa",   // core / B-Bars optional
  red:          "#f87171",   // pull / back
  amber:        "#f59e0b",   // full body / mixed
  success:      "#4ade80",
  warning:      "#fbbf24",
  danger:       "#f87171",
};
```

---

## App features to build

### Phase 1 — MVP
- [x] View today's workout (auto-detect day of week)
- [x] Toggle busy / regular week mode (persist to localStorage)
- [x] Warm-up section at top of every session
- [x] Session logger — tap to tick off each set, rest timer (60–90 sec countdown)
- [x] B-Bars optional section on every day
- [x] Coaching cues + YouTube tutorial links per exercise

### Phase 2 — Progress tracking
- [x] Weight log — enter weight, edit/delete entries, SVG chart (month/year view) toward 75 kg goal
- [x] Weight log — edit both kg and date per entry (date picker + kg field in edit row)
- [x] A/B exercise rotation — exercises alternate every 2 weeks via ISO week number
- [x] Optional Saturday bonus session (both busy and regular modes, lighter volume)
- [ ] Streak tracker — consecutive days with session logged
- [ ] Weekly completion summary
- [ ] Progression hints — prompt user to upgrade variation when hitting top of rep range

### Phase 3 — Holistic dashboard
- [ ] Daily non-negotiables checklist (6 habits)
- [ ] Sleep log (simple — just hours)
- [ ] Weekly stretch session reminder + guide
- [ ] Monthly progress photos prompt
- [ ] Nutrition summary link / integration with meal_plan_dashboard

---

## Existing components

- `meal_plan_dashboard.jsx` — nutrition tracking dashboard (already built, do not merge, share design system)

---

## Suggested file structure

```
fitness-app/
├── CLAUDE.md                        ← this file
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── api/                             ← Vercel serverless functions (Notion proxy)
│   ├── habits.js                    ← GET/POST daily habit entries to Notion
│   └── weight.js                    ← GET/POST/PATCH/DELETE weight entries to Notion
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── data/
│   │   ├── workouts.js              ← all exercise + schedule data; exports getWeekVariant(), resolveSession()
│   │   ├── nutrition.js             ← meal plan data (from meal_plan_dashboard)
│   │   └── coaching.js              ← pillars, habits, stretch routine, roadmap
│   ├── components/
│   │   ├── WorkoutDashboard.jsx     ← main view, day selector, all tabs
│   │   ├── SessionLogger.jsx        ← tick off sets, rest timer
│   │   ├── ExerciseCard.jsx         ← expandable card with cue + video
│   │   ├── WarmUp.jsx               ← warm-up flow before session
│   │   ├── BBarsPanel.jsx           ← optional desk-break exercises
│   │   ├── WeightTracker.jsx        ← log + chart weight over time
│   │   ├── StreakBadge.jsx          ← streak + weekly completion
│   │   ├── HabitChecklist.jsx       ← 6 daily non-negotiables
│   │   ├── StretchGuide.jsx         ← weekly stretch routine
│   │   ├── CoachingPlan.jsx         ← 5 pillars + 3-month roadmap
│   │   └── MealPlanLink.jsx         ← bridge to meal_plan_dashboard
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useWorkoutSession.js
│   │   └── useStreak.js
│   └── utils/
│       ├── dates.js                 ← day-of-week helpers
│       └── progress.js              ← rep range checks, progression logic
```

---

## Notion sync architecture

The app is deployed on Vercel (jh-fitness-tracker.vercel.app). Cross-device sync runs through Notion via Vercel serverless API routes that keep the `NOTION_TOKEN` server-side.

**Strategy**: localStorage is primary (offline-first). Notion syncs in the background. UI never blocks on network.

| Data | localStorage key | Notion DB env var | Syncs on |
|------|-----------------|-------------------|----------|
| Weight log | `wt_weight` | `NOTION_WEIGHT_DB_ID` | add / edit / delete |
| Daily habits | `wt_habits` | `NOTION_HABITS_DB_ID` | every toggle |
| Workout sets | `wt_sets` | — (localStorage only) | never — too granular |
| Week mode | `wt_mode` | — | never |

**Habit log key format**: `YYYY-MM-DD_habitId` (e.g. `2026-05-03_water`) — resets each calendar day automatically.

**Backward compatibility**: old habit log entries stored as plain booleans; new entries stored as `{ done: boolean, notionId: string }`. Both formats supported in `habitDone()` and `habitNotionId()`.

**Date format**: Notion stores dates as ISO `YYYY-MM-DD`. Legacy localStorage entries may be `DD/MM/YYYY`. The `displayDate()` and `toISODate()` helpers in WorkoutDashboard.jsx normalise both.

---

## Notes for Claude Code

- Always read CLAUDE.md before building or modifying anything
- User is beginner-intermediate — keep UX encouraging and simple
- Sessions should feel like a guided flow, not a reference document
- Persist everything meaningful to localStorage (mode, logs, weight, habits)
- Never merge the meal plan dashboard — keep them as companion apps sharing a design system
- When building new features, check CLAUDE.md for user context before assuming anything
- Progress is more important than perfection — ship working features, iterate
- The warm-up is mandatory in the UX — don't let user skip to exercises without seeing it
- A/B rotation is automatic — never add a manual A/B toggle for the user; `getWeekVariant()` handles it
- When adding new session types, always define them in SESSIONS as A/B pairs and update WEEKLY_SCHEDULE accordingly
