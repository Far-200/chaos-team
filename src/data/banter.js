// Short, rare agent-to-agent exchanges, inserted occasionally (not every
// run) to break up the "everyone talks at the task" pattern. {task} is
// interpolated the same way a normal beat would be. Keep these brief -
// the joke is the rhythm, not the content.
//
// `excludeCategories` keeps an exchange out of specific categories (the
// hardcoded "4" below is a funny non-sequitur almost anywhere, but would
// read as a wrong-answer bug in the math category).
// `requiresArithmetic` restricts an exchange to incidents where a real
// expression/answer was parsed from the task (see engine/parseArithmetic.js).
export const BANTER_EXCHANGES = [
  {
    lines: [
      { agentId: 'claude', text: 'Codex, did you already merge this?' },
      { agentId: 'codex', text: 'yes' },
      { agentId: 'claude', text: 'What did you merge?' },
      { agentId: 'codex', text: 'yes' },
    ],
  },
  {
    excludeCategories: ['math'],
    lines: [
      { agentId: 'chatgpt', text: 'There are three approaches we should consider—' },
      { agentId: 'copilot', text: '4' },
      { agentId: 'chatgpt', text: 'Correct. As I was saying—' },
    ],
  },
  {
    requiresArithmetic: true,
    lines: [
      { agentId: 'chatgpt', text: 'There are three approaches we should consider for {expression}—' },
      { agentId: 'copilot', text: '{answer}' },
      { agentId: 'chatgpt', text: 'Correct. As I was saying—' },
    ],
  },
  {
    lines: [
      { agentId: 'codex', text: '`git push --force`' },
      { agentId: 'copilot', text: 'bold.' },
      { agentId: 'codex', text: '`git push --force` again' },
    ],
  },
  {
    lines: [
      { agentId: 'gemini', text: 'Done. I also redesigned the navigation for "{task}".' },
      { agentId: 'claude', text: 'That wasn\'t requested.' },
      { agentId: 'gemini', text: 'You\'re welcome.' },
    ],
  },
  {
    lines: [
      { agentId: 'chatgpt', text: 'I\'ve outlined four migration strategies for "{task}".' },
      { agentId: 'gemini', text: 'I already shipped strategy two.' },
      { agentId: 'chatgpt', text: 'Which one was strategy two?' },
      { agentId: 'gemini', text: 'Unclear.' },
    ],
  },
  {
    lines: [
      { agentId: 'claude', text: 'Has anyone written a test for this yet?' },
      { agentId: 'codex', text: 'no' },
      { agentId: 'claude', text: 'Should we write one before merging?' },
      { agentId: 'codex', text: 'already merged' },
    ],
  },
  {
    lines: [
      { agentId: 'copilot', text: 'ship it' },
      { agentId: 'claude', text: 'We have not reviewed it.' },
      { agentId: 'copilot', text: 'ship it' },
    ],
  },
]
