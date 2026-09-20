# Engineering Operating Rules (Rules.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Status:** MANDATORY OPERATIONAL CONSTRAINTS  

Every AI agent, developer, and automated loop operating in this repository must strictly adhere to the following nine non-negotiable engineering rules:

---

### RULE 1: Never Present Simulated Data as Real — Always Label It
Any synthetic satellite pass, mock SAR/optical scene, pre-labelled segmentation mask, synthetic AIS vessel feed, or simplified metocean model must be explicitly badged in the UI and documented in code comments:
- Display prominent visual badges: `[● SIMULATED DATA]` or `[SYNTHETIC SCENE]`.
- Provide tooltips or notes explaining the production equivalent (e.g. *"Simulated Sentinel-1 SAR pass. In production, ingested via ESA Copernicus Hub OData API"*).
- Never claim a model is executing live satellite inference or live naval radar feeds if it is serving pre-computed/synthetic scenarios.

### RULE 2: Commit to GitHub After Each Working Feature Slice
- Never wait until the end of a phase to commit.
- Every commit message must be clean, semantic, and explicitly reference the corresponding `Phases.md` task ID.
- *Format:* `feat(attribution): add 5-factor explainable suspect scoring [TASK-05]` or `fix(map): repair layer re-centering on region switch [TASK-04]`.

### RULE 3: Verify with Playwright E2E and Postman Before Marking Phase Complete
Before marking any phase or task as `[X] COMPLETED` in `Phases.md`:
1. Execute the relevant Playwright end-to-end tests covering the touched user flows.
2. Execute the Postman collection validation against any touched REST API endpoints.
3. Both must pass with zero failures. Only then may the task checkbox be checked.

### RULE 4: Inspect Console & Network with Chrome DevTools MCP Before Closing UI Tasks
Before declaring any frontend or UI task complete:
- Use `chrome-devtools-mcp` (or browser subagent) to inspect the live application in the browser.
- Verify that the browser console has **zero uncaught exceptions, zero React key warnings, and zero broken asset 404s**.
- Verify that network requests succeed cleanly with expected payloads.

### RULE 5: Run CodeRabbit Review on Non-Trivial Diffs
- On all major architectural modifications or substantial multi-file feature additions, trigger a CodeRabbit review pass.
- Address all flagged P0 (critical) and P1 (major) findings immediately.
- If an item is deferred, explicitly record the rationale in `Memory.md`.

### RULE 6: Maintain Continuous Session Logs in Memory.md
- `Memory.md` is the single source of truth for stateless agent continuity.
- At the end of every work session or autonomous iteration, append an entry containing:
  1. Timestamp & current active Phase ID.
  2. Exactly what was accomplished in this session.
  3. Key technical/architectural decisions made and their rationale.
  4. Known bugs, warnings, or technical debt.
  5. The exact next task to execute when resuming.

### RULE 7: Follow Phases.md in Sequential Order
- Do not skip ahead to polish late-stage UI animations while earlier core domain models or API endpoints are incomplete or failing tests.
- Strictly adhere to the order defined in `Phases.md`.

### RULE 8: Mirror Progress to Task Trackers
- When external tracking systems or task files (e.g. `docs/tasks/progress.txt`) exist, keep them 100% synchronized with `Phases.md` so project status is immediately visible to evaluators and collaborators.

### RULE 9: Never Let a Broken Build Sit Uncommitted
- A passing, stable, even if feature-incomplete build is always strictly preferable to an ambitious broken one.
- Before ending any turn or pushing to the remote repository, ensure `npm run build` and `npm test` execute cleanly with zero errors.
