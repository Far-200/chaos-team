// Low-probability flavor events - at most one per incident, most incidents
// get none. `typingOverrideMs` lets a rare agent event use non-default
// typing pacing (e.g. ChatGPT thinking unusually long).
export const RARE_EVENTS = [
  { kind: 'system', text: 'Gemini joined the channel.', deltas: {} },
  { kind: 'agent', agentId: 'codex', text: 'renamed `final` to `final-v2`.', deltas: { files: 1, chaos: 2 } },
  { kind: 'agent', agentId: 'claude', text: 'uploaded `architecture-final-FINAL-v3.md`.', deltas: { files: 1, tokens: 600 } },
  { kind: 'system', text: 'Copilot left the conversation.', deltas: { sanity: 1 } },
  {
    kind: 'agent',
    agentId: 'chatgpt',
    text: 'types for an unusually long time, then sends: "Yes."',
    deltas: { tokens: 200 },
    typingOverrideMs: [2800, 4200],
  },
  { kind: 'system', text: 'A human engineer joined the channel. They have not said anything yet.', deltas: {} },
  { kind: 'system', text: 'Everyone briefly stops typing.', deltas: {} },
  { kind: 'agent', agentId: 'codex', text: 'gotta go', deltas: { chaos: 1 } },
  { kind: 'system', text: 'A new teammate has been auto-assigned to this incident. They have context.', deltas: { sanity: -1 } },
]
