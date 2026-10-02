// Quick-reply presets offered during an intervention pause. Each has a
// deterministic stat nudge and a specific scripted reaction from one agent.
export const USER_REPLY_PRESETS = [
  {
    id: 'do-the-task',
    label: 'Please just do the task.',
    deltas: { chaos: -4, sanity: 2 },
    reaction: {
      agentId: 'claude',
      text: 'acknowledges the note and updates the specification to reflect a single, focused task.',
    },
  },
  {
    id: 'stop-touching',
    label: 'STOP TOUCHING THINGS.',
    deltas: { chaos: -2, sanity: -1 },
    reaction: {
      agentId: 'codex',
      text: 'replies `too late` and keeps running commands.',
    },
  },
  {
    id: 'trust-you',
    label: 'I trust you guys 👍',
    deltas: { chaos: 6, sanity: -3 },
    reaction: {
      agentId: 'gemini',
      text: 'confidently replies "On it!" and deploys the change to two more environments, just in case.',
    },
  },
]

// Generic reaction pools for free-typed messages - no semantic processing,
// just one persona-flavored line picked at random, per agent.
export const AGENT_REACTIONS = {
  claude: [
    'updates the spec to reflect your feedback and adds two more review tests.',
    'acknowledges the note and quietly revises the plan.',
    'says "noted" and adds a section to the RFC about it.',
  ],
  codex: [
    'replies `too late` and keeps running commands.',
    '"already pushed." (`git log` suggests otherwise.)',
    'sends a thumbs-up emoji and force-pushes again.',
  ],
  copilot: [
    'replies "on it." Is not, in fact, on it.',
    '"got it 👍"',
    'suggests an autocomplete for your message instead of replying to it.',
  ],
  chatgpt: [
    'begins analyzing three possible interpretations of your message.',
    '"Great point! Here are two ways we could proceed..."',
    'turns your one sentence into a 4-point action plan.',
  ],
  gemini: [
    '"Got it - deploying that change across all environments now."',
    'responds confidently, already doing something slightly different.',
    '"Totally agree!" (context unclear.)',
  ],
}
