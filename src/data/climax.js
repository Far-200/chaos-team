// One climax beat fires partway through every incident. Picked from the
// pool matching the task's category so the "disaster" stays on-topic.
export const CLIMAX_BY_CATEGORY = {
  ui: [
    { text: 'A merge conflict erupts between three branches that all touch the same 4px of margin.', deltas: { chaos: 14, sanity: -5 } },
    { text: 'The design system now has more tokens than the app has pages.', deltas: { chaos: 15, files: 2, sanity: -5 } },
    { text: 'Staging goes down. The spacing, for the record, is still off.', deltas: { chaos: 18, sanity: -7 } },
    { text: 'Someone ships the fix directly to production at 2am.', deltas: { chaos: 20, sanity: -8, files: 2 } },
  ],
  code: [
    { text: 'The fix for the bug has introduced a second, more interesting bug.', deltas: { chaos: 16, tests: 2, sanity: -6 } },
    { text: 'A stack trace has been pasted into three different chat threads.', deltas: { chaos: 14, sanity: -5 } },
    { text: 'The test suite now fails in a way nobody can reproduce.', deltas: { chaos: 18, tests: 4, sanity: -7 } },
    { text: 'The function has been rewritten four times and does the same thing.', deltas: { chaos: 15, files: 2, sanity: -5 } },
  ],
  math: [
    { text: 'A dependency vulnerability has been introduced while calculating {expression}.', deltas: { chaos: 18, tests: 2, sanity: -6 } },
    { text: 'A dependency vulnerability has been introduced mid-calculation.', deltas: { chaos: 18, tests: 2, sanity: -6 } },
    { text: 'The calculation now depends on a package that depends on a package that no longer exists.', deltas: { chaos: 20, sanity: -7 } },
    { text: 'A math library import has been added for a problem with no variables.', deltas: { chaos: 14, tokens: 1200, sanity: -5 } },
    { text: 'The arithmetic has been blocked pending architectural approval.', deltas: { chaos: 16, sanity: -6 } },
  ],
  text: [
    { text: 'The find-and-replace has touched a file it should not have touched.', deltas: { chaos: 18, files: 3, sanity: -7 } },
    { text: 'The string now exists in two languages, both wrong.', deltas: { chaos: 14, sanity: -5 } },
    { text: 'A localization key has gone missing in production.', deltas: { chaos: 16, tests: 2, sanity: -6 } },
    { text: 'The typo has shipped to seven new languages.', deltas: { chaos: 15, files: 6, sanity: -5 } },
  ],
  config: [
    { text: 'A dependency vulnerability has been introduced while updating a dependency.', deltas: { chaos: 18, tests: 2, sanity: -6 } },
    { text: 'The lockfile and the manifest now disagree.', deltas: { chaos: 16, sanity: -6 } },
    { text: 'A transitive dependency has been orphaned mid-build.', deltas: { chaos: 15, sanity: -5 } },
    { text: 'The build pipeline has started rebuilding itself.', deltas: { chaos: 20, sanity: -7 } },
  ],
  git: [
    { text: 'A merge conflict erupts between three branches that all claim to fix the same thing.', deltas: { chaos: 16, sanity: -6 } },
    { text: 'The commit history has been rewritten. Twice.', deltas: { chaos: 15, sanity: -5 } },
    { text: 'A force-push has overwritten six hours of someone else\'s work.', deltas: { chaos: 20, sanity: -8 } },
    { text: 'The repository now has more branches than commits.', deltas: { chaos: 14, branches: 2, sanity: -5 } },
  ],
  generic: [
    { text: 'Nobody can agree on what the task was, three hours in.', deltas: { chaos: 16, sanity: -6 } },
    { text: 'A meeting has been scheduled to clarify a task nobody can define.', deltas: { chaos: 14, sanity: -5 } },
    { text: 'The original request has been reinterpreted for the fourth time.', deltas: { chaos: 15, sanity: -5 } },
    { text: 'Staging goes down for reasons nobody can connect back to the task.', deltas: { chaos: 18, sanity: -7 } },
  ],
}
