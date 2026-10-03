# Chaos

**Five coding assistants. One tiny task. A deterministic incident waiting to happen.**

[Try the live demo](https://chaos.farhaankhan.dev/) | [GitHub repository](https://github.com/Far-200/chaos-team)

## What is Chaos?

Chaos is a deterministic, browser-only simulation of five AI coding-assistant characters reacting to a limited set of supported coding tasks inside a shared group chat.

Claude, Codex, Copilot, ChatGPT, and Gemini are fictionalized characters with locally defined dialogue. No real models are called. Give the room something small, like centering a button, and watch it accumulate branches, broken tests, and documentation nobody requested before producing an incident-style postmortem.

The engineering lives in local task classification, seeded incident generation, paced chat playback, intervention handling, and reproducible outcomes. All the apparent coding activity happens inside the simulation.

## Try it

**[Open Chaos in your browser](https://chaos.farhaankhan.dev/)** and choose a suggested incident, or type a task from the supported categories below. Start with `Center the login button`. It sounds safe.

Input support is intentionally limited to predefined content categories. The text box does not provide open-ended AI prompting; unmatched input receives the generic scripted fallback.

## How it works

```text
Supported task input
  -> local keyword/pattern classification
  -> canonical task identity
  -> stable seed (FNV-1a)
  -> seeded incident generation (Mulberry32)
  -> chat playback, interventions, and reactions
  -> escalation and accumulated simulation stats
  -> incident-style postmortem
```

The classifier chooses a category. That category becomes the canonical task key; for successfully parsed arithmetic, the key also includes normalized operands and the operator, such as `math:2+2`.

A small, locally implemented **FNV-1a hash** turns the key into a numeric seed. **Mulberry32**, a seeded pseudorandom generator, uses it to select dialogue, character participation, flavor events, escalation, intervention points, and pacing. These are scripted/procedural selections from local data, built before playback starts.

Custom reactions use a separate derived seed for each intervention point. Postmortem selections use their own stream derived from the canonical task key. Preset replies carry scripted reactions and stat changes; free-typed replies receive predefined acknowledgements without semantic processing. Final stats determine whether the incident is resolved, resolved technically, or rolled back.

## Determinism

**Same canonical task + same intervention choices = the same incident selections, reaction order, escalation, outcome, and postmortem selections.**

- Equivalent phrasings that map to the same identity select the same variants. `reverse a string`, `reverse this string`, and `string reverse` all map to `text`.
- Original task wording is still echoed in dialogue and report placeholders. Equivalent phrasings therefore need not produce byte-for-byte identical displayed text.
- Different canonical identities can produce different deterministic sequences. Different descriptions within one category generally share a sequence; the classifier does not assign every task its own ID.
- Resetting and rerunning starts fresh. No global random state advances between incidents.
- Intervention presets still change stats. Reproduce the same choices, including whether and when you skip, to reproduce the complete incident.
- **Surprise me** randomly chooses a suggested task before deployment. Chat timestamps reflect display time. Neither influences incident choices once the task is selected.

These guarantees apply to the same version of the simulation and its content. Editing dialogue pools or generation logic can change the resulting incident.

## What it is not

- No live Claude, Codex, Copilot, ChatGPT, or Gemini API calls.
- No autonomous agents or real model collaboration.
- No backend or API keys required.
- No arbitrary prompt answering or LLM fallback.
- No actual file edits, shell commands, commits, or deployments performed by the characters. Even the token counter is simulated.

## The incident loop

1. Choose a suggested task or enter a supported task description.
2. Click **Deploy**. Chaos classifies the input locally and builds the seeded incident.
3. Watch the group chat deteriorate while the simulation tracks chaos, files changed, tests broken, branches, tokens, and team sanity.
4. At intervention pauses, choose a preset reply or type a message. Asking everyone to stop has a scripted consequence. Trusting them does too.
5. Reach the postmortem: outcome, final stats, root causes, and a closing note. **Skip to end** fast-forwards the remaining incident; **Abort** returns to the start.
6. Choose **New Incident** to reset and replay.

## Supported inputs

Classification uses keyword and pattern scores, with a fixed tie-breaking order. These are content categories, not promises that the app will carry out the requested work.

| Category | Recognized themes | Example input |
| --- | --- | --- |
| `math` | Arithmetic and calculation | `What is 2+2?` |
| `text` | Typos, wording, renaming, strings | `Fix a typo in the footer` |
| `ui` | CSS, layout, colors, buttons, spacing | `Center the login button` |
| `config` | Dependencies, versions, environment, configuration | `Update React` |
| `git` | Commits, branches, merges, rebases | `git rebase` |
| `code` | Functions, bugs, arrays, algorithms | `sort an array` |
| `generic` | Fallback when no category matches | `hello there` |

For math-category inputs, a small parser can evaluate a single binary expression using `+`, `-`, `*`, `/`, or `%`. It supports negative numbers and decimals. Unparseable or non-finite results, including division by zero, exclude dialogue that requires an answer. It is not a general math solver.

Unmatched nonempty input still starts a generic scripted incident. It does not unlock broader capabilities or contact an AI service.

## Characters

| Character | Role in this fictional room |
| --- | --- |
| Claude | Writes the requirements, the tests, and probably an RFC before touching the button. |
| Codex | Opens the terminal. Already pushed. Explanation pending. |
| Copilot | A one-line menace who is occasionally the only sensible person here. |
| ChatGPT | Offers options, trade-offs, and a migration plan for your tiny change. |
| Gemini | Confidently expands scope to solve the problem next door. |

These are fictionalized simulation characters inspired by familiar coding-assistant archetypes; they do not represent actual model behavior. Gemini's participation in the main incident is seeded, so the five-character cast does not mean all five appear in every run.

## Tech stack

- React 19 and React DOM for the interface and playback state.
- Vite 8 for development and production builds.
- JavaScript and CSS; browser-only application logic.
- Local FNV-1a hashing and Mulberry32 PRNG implementations, with no randomness dependency.
- Node's built-in test runner, Oxlint, and a separate Playwright browser verification script.

## Project structure

```text
src/
  App.jsx                    # Playback, interventions, reset, and skip
  components/                # Chat UI, composer, stats, and postmortem card
  data/                      # Characters, dialogue pools, presets, and incidents
  engine/
    classifyTask.js          # Local keyword/pattern classifier
    taskIdentity.js          # Canonical category/arithmetic identity
    seededRandom.js          # Hash, seeded PRNG, and bound selection helpers
    buildIncident.js         # Prebuilt event sequence and intervention points
    buildReactions.js        # Seeded acknowledgements for custom replies
    buildPostmortem.js       # Outcome and seeded report selections
    parseArithmetic.js       # Small arithmetic parser
    stats.js                 # Stat accumulation and bounds
    utils.js                 # Templates and selection helpers
    *.test.mjs               # Arithmetic and determinism tests
scripts/
  verify-browser.mjs         # Browser replay and UI regression checks
```

## Run locally

Use Node.js **20.19+ on the 20.x line, or 22.12+**, with npm, to satisfy Vite's Node requirement.

```sh
git clone https://github.com/Far-200/chaos-team.git
cd chaos-team
npm install
npm run dev
```

Open the local URL printed by Vite. No API keys or application environment variables are needed.

For a production build and local preview:

```sh
npm run build
npm run preview
```

The build writes static assets to `dist/`.

## Tests and verification

```sh
npm test
npm run lint
npm run build
git diff --check
```

Engine tests compare structured incidents, reactions, stats, and postmortems across repeated runs. They cover equivalent phrasings, different canonical tasks, independence from previous runs, generic fallback behavior, arithmetic guards, stable PRNG values, and the absence of ambient randomness or wall-clock reads in outcome builders.

For browser verification, start the **Vite development server** and make a separately installed Playwright package and its Chromium browser available. Playwright is not included in this project's dependencies.

```sh
node scripts/verify-browser.mjs
```

If Playwright is installed outside the project, set `PLAYWRIGHT_MODULE` to the absolute path of its `index.mjs`. The script defaults to `http://127.0.0.1:5173`; set `CHAOS_URL` if your development server uses another address. It imports source modules through Vite, so use the development server rather than a production preview.

The browser check uses a controlled clock to exercise full progression, mixed preset/custom interventions, reset/replay, different tasks, generic input, skip, abort cleanup, mobile overflow, and console errors. It prints dialogue/postmortem signatures and writes temporary screenshots to `dist/verification/`.

## Design principle

Chaos should feel unpredictable while being reproducible underneath. The room can turn a two-pixel adjustment into an incident report; the same decisions should get you the same report again.

**The chaos is scripted. The consequences are reproducible.**

## Links

- [Live demo](https://chaos.farhaankhan.dev/)
- [GitHub repository](https://github.com/Far-200/chaos-team)
