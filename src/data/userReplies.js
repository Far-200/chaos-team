// Quick-reply presets offered during an intervention pause. Each has a
// deterministic stat nudge and a short, specific scripted consequence -
// a sequence of steps, each either an agent line (shows typing) or a
// system line (no typing, just appears).
export const USER_REPLY_PRESETS = [
  {
    id: 'do-the-task',
    label: 'Please just do the task.',
    deltas: { chaos: -5, sanity: 2 },
    steps: [
      { agentId: 'claude', text: 'Understood. I\'ll reduce scope.' },
      { system: 'Claude created `SCOPE_REDUCTION_PLAN.md`.' },
    ],
  },
  {
    id: 'stop-touching',
    label: 'STOP TOUCHING THINGS.',
    deltas: { chaos: -7, sanity: -3, files: -2 },
    steps: [
      { agentId: 'codex', text: 'understood' },
      { system: 'Codex ran `git reset --hard`.' },
      { system: 'Several things have stopped existing.' },
    ],
  },
  {
    id: 'trust-you',
    label: 'I trust you guys 👍',
    deltas: { chaos: 12, sanity: -5, branches: 3 },
    steps: [
      { agentId: 'claude', text: 'Thank you. That gives us room to address some underlying architectural concerns.' },
      { agentId: 'codex', text: 'finally' },
      { system: 'Three new branches have appeared.' },
    ],
  },
]

// Generic reaction pools for free-typed messages - no semantic processing,
// just one persona-flavored acknowledgement picked at random, per agent.
export const AGENT_REACTIONS = {
  claude: [
    'updates the spec to reflect your feedback.',
    'acknowledges the note and quietly revises the plan.',
    'says "noted" and adds a section to the RFC about it.',
  ],
  codex: [
    'replies `too late` and keeps running commands.',
    '"already pushed." (`git log` suggests otherwise.)',
    'sends a thumbs-up emoji and keeps going.',
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
