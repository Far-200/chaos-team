// Kickoff/wrapup bookend every incident. The ambient pool supplies the
// occasional extra system line ("extras schedule" in buildIncident) that
// stays flavored to the task's category without being tied to any agent.
export const SYSTEM_BEATS = {
  kickoff: (task) => `Incident declared: "${task}". The team has been deployed to #chaos-team.`,
  wrapup: 'The dust settles. Someone has started writing the postmortem.',
}

export const AMBIENT_SYSTEM_BY_CATEGORY = {
  ui: ['A design review has been scheduled for Thursday.', 'Figma has been opened. Figma has not been closed.', 'The style guide has been updated for the fourth time today.'],
  code: ['A code review has been scheduled.', 'The bug has been assigned a ticket, a label, and a milestone.', 'CI is now flaky in a new and exciting way.'],
  math: ['A CI pipeline now runs on every arithmetic change.', 'The calculation has been assigned a ticket number.', 'A design review has been scheduled to discuss the number 4.'],
  text: ['A copy review has been scheduled.', 'The glossary has been updated for the third time.', 'Localization has been assigned a ticket.'],
  config: ['A security scan has been scheduled.', 'The changelog has been updated for the fifth time today.', 'CI is now failing for reasons unrelated to the change.'],
  git: ['A branch cleanup has been scheduled.', 'The commit history has been rewritten twice.', 'CI is now blocked on a branch nobody remembers creating.'],
  generic: ['A clarification has been requested. No reply yet.', 'The task has been re-scoped twice without anyone noticing.', 'A meeting has been scheduled to discuss the meeting.'],
}
