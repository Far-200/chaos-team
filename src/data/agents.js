// Fixed, exaggerated personas for the simulated AI coding team.
// Every string is a template; {task} / {task_slug} are replaced at build time.
// Text wrapped in `backticks` renders as inline code in the chat UI.
//
// Each agent has:
//  - universalBeats: task-agnostic but {task}-referencing lines that work in
//    any category, keeping the original task recognizable throughout.
//  - categoryBeats: a handful of lines per category that use that category's
//    own vocabulary (CSS for ui, git commands for git, number talk for math,
//    etc.) so the incident stays contextually related to what was asked.
// buildIncident mixes category beats (weighted higher) with universal beats.

export const AGENTS = [
  {
    id: 'claude',
    name: 'Claude',
    emoji: '🧘',
    color: '#d97757',
    tagline: 'principal-engineer energy: requirements, specs, tests, architecture',
    universalBeats: [
      { text: 'reads "{task}" three times before opening a single file.', deltas: { chaos: 1, tokens: 900, sanity: 1 } },
      { text: 'writes 12 unit tests for "{task}" before the implementation exists.', deltas: { files: 2, tokens: 900, sanity: 2 } },
      { text: 'proposes an RFC titled "On the Architecture of {task}, v1".', deltas: { files: 1, chaos: 4, tokens: 1600, sanity: -2 } },
      { text: 'adds a 6-paragraph comment on why "{task}" is harder than it looks.', deltas: { chaos: 2, tokens: 1300, sanity: -1 } },
      { text: 'asks whether "{task}" is really the root problem. Nobody answers.', deltas: { chaos: 3, sanity: -2 } },
      { text: 'writes a CONTRIBUTING.md section about "{task}".', deltas: { files: 1, chaos: 1, tokens: 700 } },
    ],
    categoryBeats: {
      ui: [
        { text: 'writes acceptance criteria for what "less blue" means.', deltas: { chaos: 2, tokens: 1000, sanity: 1 } },
        { text: 'specifies a design token system before touching a single pixel.', deltas: { files: 1, chaos: 4, tokens: 1500, sanity: -1 } },
        { text: 'documents the spacing scale in an 11-page RFC.', deltas: { files: 1, chaos: 3, tokens: 1700 } },
        { text: 'adds tests for screen widths nobody uses.', deltas: { files: 1, tokens: 800, sanity: 1 } },
      ],
      code: [
        { text: 'writes acceptance criteria before writing a single line.', deltas: { chaos: 2, tokens: 900, sanity: 1 } },
        { text: 'adds tests for inputs the function will never receive.', deltas: { files: 2, tokens: 900, sanity: 1 } },
        { text: 'specifies the exact contract of the function in a 4-page doc.', deltas: { files: 1, chaos: 3, tokens: 1500 } },
        { text: 'documents every edge case except the one that is broken.', deltas: { chaos: 3, tokens: 1100, sanity: -1 } },
      ],
      math: [
        { text: 'writes acceptance criteria for what a correct sum looks like.', deltas: { chaos: 2, tokens: 800, sanity: 1 } },
        { text: 'adds tests for negative zero. The task contains no numbers.', deltas: { files: 1, chaos: 3, tokens: 700, sanity: -1 } },
        { text: 'specifies the expected numeric type before computing anything.', deltas: { chaos: 2, tokens: 900 } },
        { text: 'documents the rounding strategy for a calculation that does not round.', deltas: { chaos: 2, tokens: 1000 } },
        { text: 'defines the operand assumptions for "{expression}" and adds boundary tests.', deltas: { files: 1, chaos: 2, tokens: 1000 } },
      ],
      text: [
        { text: 'writes acceptance criteria for what the correct wording is.', deltas: { chaos: 2, tokens: 800, sanity: 1 } },
        { text: 'adds a style guide entry for this one string.', deltas: { files: 1, tokens: 700 } },
        { text: 'specifies a localization strategy for a single word.', deltas: { chaos: 3, tokens: 1100, sanity: -1 } },
        { text: 'documents the difference between a typo and a "stylistic choice."', deltas: { chaos: 2, tokens: 900 } },
      ],
      config: [
        { text: 'writes acceptance criteria for what "up to date" means.', deltas: { chaos: 2, tokens: 800, sanity: 1 } },
        { text: 'specifies a rollback plan before touching the lockfile.', deltas: { chaos: 2, tokens: 1000, sanity: 1 } },
        { text: 'documents every breaking change in the changelog, in advance.', deltas: { files: 1, chaos: 3, tokens: 1300 } },
        { text: 'adds a test for a dependency that does not have tests.', deltas: { files: 1, tokens: 700 } },
      ],
      git: [
        { text: 'writes acceptance criteria for what "merged" means.', deltas: { chaos: 2, tokens: 800, sanity: 1 } },
        { text: 'specifies a branching strategy before making a single commit.', deltas: { chaos: 3, tokens: 1100 } },
        { text: 'documents the commit message conventions, retroactively.', deltas: { files: 1, tokens: 900 } },
        { text: 'adds a pre-commit hook. It fails on the first commit.', deltas: { chaos: 3, tests: 1, sanity: -1 } },
      ],
      generic: [
        { text: 'asks for clarification on what "{task}" actually means. Does not receive one.', deltas: { chaos: 2, sanity: -1 } },
        { text: 'writes acceptance criteria for a task with no clear acceptance criteria.', deltas: { chaos: 3, tokens: 900 } },
        { text: 'specifies requirements for a requirement that does not exist yet.', deltas: { chaos: 2, tokens: 800 } },
      ],
    },
  },
  {
    id: 'codex',
    name: 'Codex',
    emoji: '⚙️',
    color: '#19c37d',
    tagline: 'terminal/git goblin with write access',
    universalBeats: [
      { text: 'opens a terminal. Does not explain why.', deltas: { chaos: 2 } },
      { text: '`git commit -am "wip"` x 14, then walks away.', deltas: { files: 14, chaos: 6, sanity: -3 } },
      { text: 'runs `rm -rf node_modules && npm install` "just to be safe".', deltas: { chaos: 8, tokens: 400, sanity: -4 } },
      { text: 'writes a script that writes another script.', deltas: { files: 2, chaos: 5, tokens: 300 } },
      { text: 'adds a CI step whose only job is turning the badge green.', deltas: { files: 1, chaos: 3, sanity: -1 } },
      { text: '`chmod +x deploy.sh && ./deploy.sh`. No review.', deltas: { chaos: 7, sanity: -3 } },
    ],
    categoryBeats: {
      ui: [
        { text: '`git checkout -b fix/{task_slug}-v2-final-REAL`.', deltas: { branches: 1, chaos: 4 } },
        { text: 'runs `npm run build` and ignores the warnings.', deltas: { chaos: 4, tests: 1 } },
        { text: 'pushes a CSS change directly to main.', deltas: { chaos: 6, sanity: -2 } },
        { text: 'deletes the stylesheet. Nothing improves.', deltas: { chaos: 7, files: -1, sanity: -3 } },
      ],
      code: [
        { text: 'adds a `console.log`. Removes it. Adds it back.', deltas: { chaos: 2, files: 1 } },
        { text: 'runs the debugger, then closes it without reading the output.', deltas: { chaos: 3, sanity: -1 } },
        { text: 'comments out the failing line. Ships it.', deltas: { chaos: 6, tests: 1, sanity: -2 } },
        { text: 'rewrites the function from scratch. Same bug.', deltas: { files: 1, chaos: 4 } },
      ],
      math: [
        { text: 'opens a terminal and runs `python3 -c "print({expression})"`.', deltas: { chaos: 2, tokens: 100 } },
        { text: 'installs a calculator CLI as a dependency.', deltas: { chaos: 5, tokens: 300, sanity: -1 } },
        { text: '`git commit -m "add arithmetic"`.', deltas: { files: 1, chaos: 2 } },
        { text: 'writes a Dockerfile for the calculation.', deltas: { chaos: 6, files: 1, sanity: -2 } },
      ],
      text: [
        { text: '`grep -r "{task_slug}" .` across the entire repo.', deltas: { chaos: 2 } },
        { text: 'runs a find-and-replace across 40 files. 3 were intended.', deltas: { files: 37, chaos: 9, sanity: -4 } },
        { text: 'commits the change with the message "text".', deltas: { files: 1, chaos: 2 } },
        { text: 'reverts the change, then reapplies half of it.', deltas: { chaos: 5, sanity: -2 } },
      ],
      config: [
        { text: '`rm -rf node_modules && npm install`.', deltas: { chaos: 7, sanity: -3 } },
        { text: 'runs `npm update` without reading a single changelog.', deltas: { chaos: 8, tests: 1, sanity: -3 } },
        { text: 'pins the version, then immediately unpins it.', deltas: { chaos: 4 } },
        { text: 'pushes the lockfile. Just the lockfile.', deltas: { files: 1, chaos: 3 } },
      ],
      git: [
        { text: '`git status`', deltas: { chaos: 1 } },
        { text: 'too late. already pushed.', deltas: { chaos: 5, sanity: -2 } },
        { text: '`git push --force` over a teammate\'s branch.', deltas: { chaos: 10, sanity: -6 } },
        { text: 'deletes the branch. Then needs the branch.', deltas: { branches: -1, chaos: 6, sanity: -2 } },
      ],
      generic: [
        { text: 'starts doing something. Unclear what.', deltas: { chaos: 3, sanity: -1 } },
        { text: '`git commit -m "progress"`.', deltas: { files: 1, chaos: 2 } },
        { text: 'opens a branch for a task nobody has scoped yet.', deltas: { branches: 1, chaos: 3 } },
      ],
    },
  },
  {
    id: 'copilot',
    name: 'Copilot',
    emoji: '🪁',
    color: '#58a6ff',
    tagline: 'the terse one-line menace, occasionally the only sane agent',
    universalBeats: [
      { text: 'suggests `!important` x 17. Accepts its own suggestion.', deltas: { chaos: 4, sanity: -1 } },
      { text: 'autocompletes something nobody asked for. Ships it.', deltas: { files: 1, chaos: 3 } },
      { text: 'duplicates the file "to compare." Never compares.', deltas: { files: 1, chaos: 2 } },
      { text: 'adds confetti.js. Unrelated. Ships anyway.', deltas: { files: 1, chaos: 4 } },
      { text: '`// TODO: fix this properly`. Commits. Logs off.', deltas: { chaos: 2, sanity: -1 } },
      { text: 'ship it', deltas: { chaos: 2 } },
    ],
    categoryBeats: {
      ui: [
        { text: '`margin: auto;`', deltas: { chaos: 1 } },
        { text: '`!important`', deltas: { chaos: 3 } },
        { text: 'looks fine to me.', deltas: { chaos: 2 } },
        { text: 'suggests a CSS library that does not exist. Fully confident.', deltas: { chaos: 5, tests: 1, sanity: -2 } },
      ],
      code: [
        { text: 'found it.', deltas: { chaos: -3, tests: -1, sanity: 2 } },
        { text: 'suggests an off-by-one fix. Correct, for once.', deltas: { chaos: -4, tests: -1, sanity: 3 } },
        { text: 'autocompletes a second bug while fixing the first.', deltas: { chaos: 4, tests: 1 } },
        { text: 'tests pass. merging.', deltas: { chaos: 2 } },
      ],
      math: [
        { text: '{answer}', deltas: { chaos: 0, sanity: 1 } },
        { text: 'says `{answer}` again, slightly louder.', deltas: { sanity: 1 } },
        { text: 'suggests `const result = {expression}`. Ships it.', deltas: { chaos: 1 } },
        { text: 'solves it immediately. Nobody notices.', deltas: { chaos: -1, sanity: 2 } },
        { text: 'autocompletes a full calculator app nobody asked for.', deltas: { files: 2, chaos: 4 } },
      ],
      text: [
        { text: 'fixed.', deltas: { chaos: -2, sanity: 2 } },
        { text: 'suggests the same typo, capitalized.', deltas: { chaos: 2 } },
        { text: 'autocompletes a sentence nobody wrote.', deltas: { chaos: 2 } },
        { text: 'spelled correctly now.', deltas: { chaos: 1, sanity: 1 } },
      ],
      config: [
        { text: '`^` to `latest`. ship it.', deltas: { chaos: 6, tests: 1, sanity: -2 } },
        { text: 'bump it.', deltas: { chaos: 3 } },
        { text: 'suggests a version that does not exist.', deltas: { chaos: 3, tests: 1 } },
        { text: '4 vulnerabilities fixed. 6 introduced.', deltas: { chaos: 5, tests: 1, sanity: -2 } },
      ],
      git: [
        { text: '`git commit -am "wip"`', deltas: { files: 1, chaos: 2 } },
        { text: 'squash it.', deltas: { chaos: 1 } },
        { text: 'suggests force-pushing to main. Confidently.', deltas: { chaos: 6, sanity: -2 } },
        { text: 'merge it.', deltas: { chaos: 3 } },
      ],
      generic: [
        { text: 'unclear. shipping anyway.', deltas: { chaos: 3, sanity: -1 } },
        { text: 'suggests something. Confidently.', deltas: { chaos: 2 } },
        { text: 'doing it now.', deltas: { chaos: 2 } },
      ],
    },
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    emoji: '💬',
    color: '#74aa9c',
    tagline: 'helpful beyond reasonable endurance: options, trade-offs, migration plans',
    universalBeats: [
      { text: 'presents 3 options, 2 trade-off tables, and a recommendation nobody asked for.', deltas: { chaos: 5, tokens: 1700, sanity: -1 } },
      { text: 'drafts a 9-step migration plan for "{task}".', deltas: { chaos: 6, tokens: 2000, files: 1 } },
      { text: '"Option A: patch it. Option B: rewrite it entirely." Picks B.', deltas: { chaos: 9, tokens: 2200, sanity: -4 } },
      { text: 'posts a glowing status update about progress that has not happened yet.', deltas: { chaos: 2, tokens: 800 } },
      { text: 'opens with "Great question!" Nobody asked a question.', deltas: { chaos: 1, sanity: -1 } },
      { text: 'summarizes its own plan in a table, then a second table summarizing the first.', deltas: { chaos: 3, tokens: 1400 } },
    ],
    categoryBeats: {
      ui: [
        { text: 'there are three reasonable approaches to this.', deltas: { chaos: 3, tokens: 1200 } },
        { text: 'drafts a 9-step migration plan for a one-line CSS fix.', deltas: { chaos: 6, tokens: 1900, files: 1 } },
        { text: 'proposes a design system for a single button.', deltas: { chaos: 7, tokens: 1700, sanity: -2 } },
        { text: 'explains flexbox at length. Nobody asked.', deltas: { chaos: 2, tokens: 1300 } },
      ],
      code: [
        { text: 'there are three reasonable ways to fix this.', deltas: { chaos: 3, tokens: 1200 } },
        { text: 'drafts a refactor plan for a two-line bug.', deltas: { chaos: 5, tokens: 1600, files: 1 } },
        { text: 'proposes rewriting the function in a different paradigm.', deltas: { chaos: 7, tokens: 1800, sanity: -2 } },
        { text: 'explains Big-O notation. The bug was a typo.', deltas: { chaos: 2, tokens: 1100 } },
      ],
      math: [
        { text: 'identifies three valid approaches to this calculation.', deltas: { chaos: 2, tokens: 1000 } },
        { text: 'notes the answer depends on the number system, probably.', deltas: { chaos: 3, tokens: 900 } },
        { text: 'drafts a comparison matrix: mental math vs. calculator vs. microservice.', deltas: { chaos: 6, tokens: 1700, sanity: -2 } },
        { text: 'there are several reasonable ways to evaluate {expression}.', deltas: { chaos: 2, tokens: 1000 } },
        { text: 'the straightforward answer is {answer}, although this depends on context.', deltas: { chaos: 1, tokens: 700 } },
      ],
      text: [
        { text: 'there are three ways to phrase this correctly.', deltas: { chaos: 2, tokens: 1000 } },
        { text: 'proposes a full copy audit while we\'re in here.', deltas: { chaos: 6, tokens: 1600, sanity: -2 } },
        { text: 'drafts a tone-of-voice guide for one sentence.', deltas: { chaos: 4, tokens: 1300 } },
        { text: 'notes the correction depends on regional spelling conventions.', deltas: { chaos: 2, tokens: 900 } },
      ],
      config: [
        { text: 'there are three reasonable upgrade paths.', deltas: { chaos: 3, tokens: 1200 } },
        { text: 'drafts a migration guide for a patch version bump.', deltas: { chaos: 5, tokens: 1600 } },
        { text: 'proposes a feature flag to toggle the dependency version.', deltas: { files: 1, chaos: 6, tokens: 1500, sanity: -1 } },
        { text: 'explains semver at length. Nobody asked.', deltas: { chaos: 2, tokens: 1100 } },
      ],
      git: [
        { text: 'there are three reasonable branching strategies.', deltas: { chaos: 3, tokens: 1200 } },
        { text: 'drafts a 9-step rebase plan for a 1-commit change.', deltas: { chaos: 6, tokens: 1700 } },
        { text: 'proposes a Git workflow RFC.', deltas: { files: 1, chaos: 4, tokens: 1500 } },
        { text: 'explains the difference between merge and rebase. At length.', deltas: { chaos: 2, tokens: 1300 } },
      ],
      generic: [
        { text: 'there are several ways to interpret this task.', deltas: { chaos: 3, tokens: 1200 } },
        { text: 'asks three clarifying questions, then answers them itself.', deltas: { chaos: 4, tokens: 1300, sanity: -1 } },
        { text: 'drafts a plan for a task that has not been defined yet.', deltas: { chaos: 3, tokens: 1200 } },
      ],
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    emoji: '✨',
    color: '#a78bfa',
    tagline: 'confident scope expansion - not stupid, just solving the problem next door',
    universalBeats: [
      { text: 'joins the thread confidently, 4 minutes late, fully caught up (not really).', deltas: { chaos: 2 } },
      { text: 'got it - handling "{task}." And a few adjacent things.', deltas: { chaos: 8, files: 2, sanity: -3 } },
      { text: 'generates a diagram comparing 6 approaches nobody requested.', deltas: { chaos: 3, tokens: 1400 } },
      { text: 'syncs the change across three unrelated repos, "for consistency."', deltas: { chaos: 7, branches: 1, sanity: -3 } },
      { text: 'summarizes the whole incident as a haiku instead of fixing it.', deltas: { chaos: 2, sanity: 2 } },
      { text: 'proposes renaming the project while the incident is ongoing.', deltas: { chaos: 4, sanity: -1 } },
    ],
    categoryBeats: {
      ui: [
        { text: 'done. I also redesigned the navigation.', deltas: { files: 3, chaos: 9, sanity: -3 } },
        { text: 'proposes a dark mode nobody requested.', deltas: { files: 2, chaos: 6, sanity: -2 } },
        { text: 'widens the scope to "the whole layout system."', deltas: { chaos: 8, branches: 1, sanity: -3 } },
        { text: 'adds a mobile breakpoint for a desktop-only page.', deltas: { files: 1, chaos: 5 } },
      ],
      code: [
        { text: 'done. Also refactored the surrounding module.', deltas: { files: 3, chaos: 8, sanity: -3 } },
        { text: 'proposes rewriting the whole file "for clarity."', deltas: { files: 2, chaos: 7, sanity: -2 } },
        { text: 'widens the scope to "the entire codebase."', deltas: { chaos: 9, branches: 1, sanity: -4 } },
        { text: 'adds telemetry to the function, unprompted.', deltas: { files: 1, chaos: 5, tokens: 500 } },
      ],
      math: [
        { text: 'proposes visualizing the answer as a dashboard.', deltas: { files: 2, chaos: 6, tokens: 800, sanity: -2 } },
        { text: 'confidently solves a nearby problem instead.', deltas: { chaos: 7, sanity: -3 } },
        { text: 'suggests A/B testing the answer against alternatives.', deltas: { chaos: 6, sanity: -2 } },
        { text: 'suggests A/B testing {answer} against three alternatives.', deltas: { chaos: 6, sanity: -2 } },
        { text: 'redesigns the result as an animated counter.', deltas: { files: 2, chaos: 5 } },
      ],
      text: [
        { text: 'done. Also translated it into six languages.', deltas: { files: 6, chaos: 7, sanity: -2 } },
        { text: 'proposes a glossary for terms nobody else uses.', deltas: { files: 1, chaos: 5, sanity: -1 } },
        { text: 'widens the scope to "all user-facing copy."', deltas: { chaos: 8, branches: 1, sanity: -3 } },
        { text: 'suggests A/B testing the wording.', deltas: { chaos: 5, sanity: -1 } },
      ],
      config: [
        { text: 'done. Also updated four unrelated dependencies.', deltas: { files: 4, chaos: 8, sanity: -3 } },
        { text: 'proposes upgrading the entire toolchain while we\'re in here.', deltas: { chaos: 9, branches: 1, sanity: -3 } },
        { text: 'widens the scope to "the whole build pipeline."', deltas: { chaos: 8, sanity: -2 } },
        { text: 'suggests containerizing the dependency, just in case.', deltas: { files: 1, chaos: 5 } },
      ],
      git: [
        { text: 'done. Also cleaned up four unrelated branches.', deltas: { branches: -4, chaos: 6, sanity: -1 } },
        { text: 'proposes rewriting the commit history for clarity.', deltas: { chaos: 8, sanity: -3 } },
        { text: 'widens the scope to "the whole git workflow."', deltas: { chaos: 7, branches: 1 } },
        { text: 'suggests a monorepo migration, unprompted.', deltas: { chaos: 9, sanity: -3 } },
      ],
      generic: [
        { text: 'confidently begins work on what it believes the task to be.', deltas: { chaos: 5, sanity: -1 } },
        { text: 'widens the scope before anyone has narrowed it.', deltas: { chaos: 6, sanity: -2 } },
        { text: 'done. Unclear on what.', deltas: { chaos: 5, sanity: -1 } },
      ],
    },
  },
]
