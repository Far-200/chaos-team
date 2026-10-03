# Chaos

Chaos is a deterministic browser-only simulation of five AI coding-assistant characters reacting to a limited set of supported coding tasks: Claude, Codex, Copilot, ChatGPT, and Gemini.

No live AI APIs, backend, or autonomous agents. Inputs select locally defined dialogue through the existing keyword categories; unmatched text retains the generic scripted fallback. Free-typed interventions receive predefined acknowledgements, not generated answers.

Each run seeds Mulberry32 using an FNV-1a hash of the classifier category (plus normalized operands/operator for parsed arithmetic). Equivalent category inputs select the same incident variants, while their original wording remains in task placeholders. Postmortems and custom reactions use separate derived seeds. Resetting starts fresh; identical tasks and intervention choices reproduce the same incident and postmortem. Different user choices still apply their existing stat changes. Chat timestamps are display-only; ?Surprise me? randomly chooses an input before deployment.

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
```

Browser regression check: with the dev server running and Playwright available, run `node scripts/verify-browser.mjs`. If Playwright is installed outside this project, set `PLAYWRIGHT_MODULE` to its `index.mjs` path. This uses Chromium with a controlled clock for full playback, reset/replay, interventions, abort, skip, generic input, and mobile checks; screenshots go to `dist/verification/`.
