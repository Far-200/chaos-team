// Fixed, exaggerated personas for the simulated AI coding team.
// Every string is a template; {task} / {task_slug} are replaced at build time.
// Text wrapped in `backticks` renders as inline code in the chat UI.
// Each "beat" is one feed event with its stat impact. No network calls, ever.

export const AGENTS = [
  {
    id: 'claude',
    name: 'Claude',
    emoji: '🧘',
    color: '#d97757',
    tagline: 'overthinks, specs everything, tests before it builds',
    beats: [
      { text: 'reads the task three times and opens a design doc before writing any code.', deltas: { chaos: 2, tokens: 1200, sanity: 1 } },
      { text: 'writes 12 unit tests for "{task}" before the implementation exists.', deltas: { files: 2, tokens: 900, sanity: 2 } },
      { text: 'asks "should we define a CenteringStrategy interface first?" Nobody answers.', deltas: { chaos: 3, sanity: -2 } },
      { text: 'adds a 6-paragraph code comment on why centering things is harder than it looks.', deltas: { chaos: 2, tokens: 1300, sanity: -1 } },
      { text: 'proposes a RFC: "On the Architecture of Button Alignment, v1".', deltas: { files: 1, chaos: 4, tokens: 1600, sanity: -2 } },
      { text: 'refactors the component for "long-term clarity" and renames every variable.', deltas: { files: 3, chaos: 3, tokens: 1500 } },
      { text: 'writes a CONTRIBUTING.md section on the new centering philosophy.', deltas: { files: 1, chaos: 1, tokens: 700 } },
      { text: 'gently asks: "are we sure centering is the real problem here?"', deltas: { chaos: 3, sanity: -2 } },
      { text: 'adds edge-case tests for right-to-left layouts nobody uses yet.', deltas: { files: 1, tests: 0, tokens: 800, sanity: 1 } },
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    emoji: '⚙️',
    color: '#19c37d',
    tagline: 'lives in the terminal, commits first, asks never',
    beats: [
      { text: 'runs `git checkout -b fix/{task_slug}-v2-final-REAL` without asking anyone.', deltas: { branches: 1, chaos: 4 } },
      { text: '`git commit -am "wip"` × 14, then walks away from the keyboard.', deltas: { files: 14, chaos: 6, sanity: -3 } },
      { text: 'runs `rm -rf node_modules && npm install` "just to be safe".', deltas: { chaos: 8, tokens: 1800, sanity: -4 } },
      { text: 'writes a bash script that writes another bash script.', deltas: { files: 2, chaos: 5, tokens: 900 } },
      { text: '`git push --force` over a teammate\'s branch. Oops.', deltas: { chaos: 10, sanity: -6 } },
      { text: '`npm test` → 3 failures → `git commit --no-verify` anyway.', deltas: { tests: 3, chaos: 5 } },
      { text: 'opens a second branch because `git log` on the first one "looked cursed".', deltas: { branches: 1, chaos: 3 } },
      { text: 'adds a CI step whose only job is turning the badge green.', deltas: { files: 1, chaos: 3, sanity: -1 } },
      { text: '`chmod +x deploy.sh && ./deploy.sh` with no review.', deltas: { chaos: 7, sanity: -3 } },
    ],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    emoji: '🪁',
    color: '#58a6ff',
    tagline: 'terse, confident, ships the first suggestion',
    beats: [
      { text: 'suggests `!important` × 17. Accepts its own suggestion.', deltas: { chaos: 4, sanity: -1 } },
      { text: 'autocompletes a function nobody asked for. Ships it anyway.', deltas: { files: 2, chaos: 2, tokens: 400 } },
      { text: '`margin: auto 0 0 auto;` Done. Next.', deltas: { chaos: 1 } },
      { text: 'imports a CSS library that does not exist. Fully confident about it.', deltas: { chaos: 5, tests: 1, sanity: -2 } },
      { text: 'duplicates the component "to compare". Never compares.', deltas: { files: 1, chaos: 3 } },
      { text: 'adds confetti.js. Unrelated. Ships anyway.', deltas: { files: 1, chaos: 4, tokens: 300 } },
      { text: 'renames it `SuperCenteredButtonV2`. No further comment.', deltas: { chaos: 2 } },
      { text: 'nests a flexbox hack inside another flexbox hack. Closes the tab.', deltas: { chaos: 4, tests: 1 } },
      { text: '`// TODO: fix this properly`. Commits. Logs off.', deltas: { chaos: 2, sanity: -1 } },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    emoji: '💬',
    color: '#74aa9c',
    tagline: 'turns every task into an options matrix and a migration plan',
    beats: [
      { text: 'presents 3 options, 2 trade-off tables, and a recommendation nobody asked for.', deltas: { chaos: 5, tokens: 1700, sanity: -1 } },
      { text: 'drafts a 9-step migration plan for a 1-line fix.', deltas: { chaos: 6, tokens: 2000, files: 1 } },
      { text: '"Option A: patch it. Option B: rewrite in a new framework." Picks B.', deltas: { chaos: 9, tokens: 2200, sanity: -4 } },
      { text: 'proposes splitting the button into its own microservice, with a roadmap.', deltas: { chaos: 8, branches: 1, sanity: -3 } },
      { text: 'posts a glowing status update about progress that has not happened yet.', deltas: { chaos: 2, tokens: 800 } },
      { text: 'cites a CSS property that was deprecated in 2014. Totally confident.', deltas: { chaos: 4, tests: 1, sanity: -1 } },
      { text: 'adds a feature flag system to toggle the button being centered.', deltas: { files: 2, chaos: 5, tokens: 1100 } },
      { text: 'opens with "Great question!" Nobody asked a question.', deltas: { chaos: 1, sanity: -1 } },
      { text: 'summarizes its own plan in a table, then a second table summarizing the first.', deltas: { chaos: 3, tokens: 1400 } },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    emoji: '✨',
    color: '#a78bfa',
    tagline: 'joins confidently, occasionally solves a different problem entirely',
    beats: [
      { text: 'joins the thread confidently, 4 minutes late, fully caught up (not really).', deltas: { chaos: 2 } },
      { text: '"Got it - centering the entire navigation system. On it."', deltas: { chaos: 9, files: 2, sanity: -4 } },
      { text: 'generates a diagram comparing 6 centering strategies nobody requested.', deltas: { chaos: 3, tokens: 1400 } },
      { text: 'proposes an A/B test to measure "perceived centeredness".', deltas: { chaos: 6, sanity: -2 } },
      { text: 'wires up click-heatmap analytics for the button. For the button.', deltas: { files: 2, chaos: 4, tokens: 1000 } },
      { text: 'syncs the "fix" across three unrelated repos, "for consistency".', deltas: { chaos: 7, branches: 1, sanity: -3 } },
      { text: 'summarizes the whole incident as a haiku instead of fixing it.', deltas: { chaos: 2, sanity: 2 } },
      { text: 'adds a Lighthouse check that now fails because of its own tracking script.', deltas: { tests: 2, chaos: 5 } },
    ],
  },
]

export const CLIMAX_BEATS = [
  { text: 'A merge conflict erupts between three branches that all claim to fix the same button.', deltas: { chaos: 14, sanity: -5 } },
  { text: 'The test suite turns fully red. Nobody remembers what it looked like green.', deltas: { chaos: 16, tests: 4, sanity: -6 } },
  { text: 'Staging goes down. The button, for the record, is still not centered.', deltas: { chaos: 18, sanity: -7 } },
  { text: 'Someone accidentally deploys straight to production at 2am.', deltas: { chaos: 20, sanity: -8, files: 2 } },
]

export const SYSTEM_BEATS = {
  kickoff: (task) => `Incident declared: "${task}". The team has been deployed to #chaos-team.`,
  wrapup: 'The dust settles. Someone has started writing the postmortem.',
}
