// Root causes and closing lines, grouped by task category so the
// postmortem stays about what was actually asked. {task} is interpolated
// the same way a beat is. Universal pools add cross-category filler/variety.
export const ROOT_CAUSES_BY_CATEGORY = {
  ui: [
    'Three branches attempted to fix the same 4 pixels.',
    'A design system was introduced for a single button.',
    'Nobody asked whether the change needed a design review.',
    'The spacing scale was redefined twice during the incident.',
  ],
  code: [
    'The fix for the bug introduced a second bug.',
    'Three agents rewrote the same function independently.',
    'Nobody reproduced the original bug before fixing it.',
    'The debugger was opened once and never read.',
  ],
  math: [
    'Arithmetic was blocked pending architectural approval.',
    'A calculator dependency introduced 37 transitive packages.',
    'The only agent who answered correctly was ignored.',
    'The only agent who answered "{answer}" was ignored.',
    'Nobody verified the calculation by the end.',
    'Nobody verified that {expression} still equaled {answer} by the end.',
  ],
  text: [
    'The find-and-replace affected more files than the task mentioned.',
    'Nobody proofread the proofreading change.',
    'A one-word fix was blocked behind a tone-of-voice guide.',
    'The correction was translated before it was confirmed correct.',
  ],
  config: [
    'The lockfile was regenerated twice, by two different agents.',
    'A patch version bump introduced 37 transitive packages.',
    'Nobody read the changelog before merging.',
    'The rollback plan was written after the rollback was needed.',
  ],
  git: [
    'Three branches attempted to merge the same change.',
    'A force-push overwrote a teammate\'s work.',
    'The commit history was rewritten mid-incident.',
    'Nobody could agree on which branch was current.',
  ],
  generic: [
    'Nobody agreed on what "{task}" meant before starting.',
    'The task was reinterpreted four separate times.',
    'A clarifying question was asked and never answered.',
    'Work began before the task was fully read.',
  ],
}

export const UNIVERSAL_ROOT_CAUSES = [
  'Nobody asked whether the change actually needed five reviewers.',
  'The postmortem took longer to write than "{task}" did.',
  'A feature flag was added to toggle a feature nobody requested.',
  'Three agents solved the same problem independently, differently.',
  'Gemini interpreted "{task}" as an invitation to expand scope.',
]

export const CLOSINGS_BY_CATEGORY = {
  ui: [
    'The button remains 3px left of center, but the organization now has excellent documentation.',
    'The layout is unchanged. The design system is not.',
    'A follow-up ticket has been filed to measure the remaining pixels.',
  ],
  code: [
    'The original bug is fixed. Two new ones have been filed.',
    'The function works now. Nobody is sure why.',
    'A follow-up ticket has been filed to understand what the fix actually did.',
  ],
  math: [
    'The team recommends revisiting basic mathematics in Q4.',
    'The correct answer was never in question. Everything built around it was.',
    'A follow-up ticket has been filed to re-derive the answer from first principles.',
    'The answer is {answer}. Everything built around it is not.',
  ],
  text: [
    '"{task}" remains unchanged. The application now supports seven languages.',
    'The typo is fixed. Six new typos were introduced elsewhere.',
    'The copy is correct in English. The other six languages are a follow-up.',
  ],
  config: [
    'The dependency is updated. Fourteen others were updated along with it, unintentionally.',
    'The version bump is complete. The build has not worked since.',
    'A follow-up ticket has been filed to find out what actually changed.',
  ],
  git: [
    'The change is merged. The commit history is no longer readable by humans.',
    'The branch is deleted. A new one has already appeared.',
    'A follow-up ticket has been filed to understand what actually got merged.',
  ],
  generic: [
    'It is unclear whether "{task}" was completed. It is clear that something happened.',
    'The team has reached consensus that the task was, in fact, a task.',
    'A follow-up meeting has been scheduled to define the original meeting.',
  ],
}

export const UNIVERSAL_CLOSINGS = [
  'No agents were harmed. Several were humbled.',
  'This has been filed as a "learning" rather than a "failure".',
  'Leadership has been briefed. Leadership has questions.',
  'A calendar invite has been sent for the retro about this retro.',
]
