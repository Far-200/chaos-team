// Deterministic, keyword/pattern based task classifier. No ML, no network -
// just enough signal to stop "What is 2+2?" from drawing CSS jokes. It's
// fine if it's imperfect; it only needs to prevent obviously unrelated
// content from leaking across categories.

export const CATEGORIES = ['math', 'text', 'ui', 'config', 'git', 'code', 'generic']

// Checked in this order; the first category with a nonzero score wins ties,
// so more distinctive categories (math, text) are listed ahead of broader
// catch-alls (code).
const PATTERNS = {
  math: [
    /\d+\s*[+\-*x×/]\s*\d+/i,
    /\b(arithmetic|calculat|equation|\bsum\b|average|percent|multiply|multiplication|divide|division|subtract|square root|fibonacci|\bmath\b)\w*/i,
  ],
  text: [
    /\b(typo|misspel|spelling|rename|wording|\bcopy\b|placeholder|translat|\blabel\b|\bstring\b)\w*/i,
    /["'][^"']+["']\s*(to|->|=>)\s*["'][^"']+["']/i,
  ],
  ui: [
    /\b(css|button|colou?r|layout|spacing|\bfont\b|centre?|align|responsive|\bmobile\b|styl\w*|padding|margin|\bborder\b|\btheme\b|\bicon\b|\bmodal\b|spinner|\bhover\b|navbar|\bnav\b|header|footer|\bwidth\b|\bheight\b|round\w*|corner|dialog|accessib\w*|dark mode|\bui\b|\bux\b)\w*/i,
  ],
  config: [
    /\b(dependenc\w*|\bpackage\b|\bversion\b|\bport\b|\benv\b|environment|\binstall\b|upgrad\w*|config\w*|docker|\bnpm\b|\byarn\b|pnpm|lockfile)\w*/i,
    /\b(update|upgrade)\b[^.]{0,30}\b(react|vue|angular|node|webpack|vite|python|express|django|next ?js|typescript|rails|laravel)\b/i,
  ],
  git: [/\b(commit|branch|merge|rebase|\bpush\b|pull request|\bpr\b|revert|\bgit\b|checkout|stash|cherry-?pick)\w*/i],
  code: [
    /\b(function|algorithm|\bbug\b|\bloop\b|refactor|implement|variable|recursion|\barray\b|\bsort\b|\bparse\b|regex|exception|endpoint|\bapi\b|\bmethod\b|\bclass\b|stack trace|crash\w*)\w*/i,
  ],
}

const PRIORITY = ['math', 'text', 'ui', 'config', 'git', 'code']

export function classifyTask(task) {
  let best = 'generic'
  let bestScore = 0

  for (const category of PRIORITY) {
    const score = PATTERNS[category].reduce((n, re) => n + (re.test(task) ? 1 : 0), 0)
    if (score > bestScore) {
      best = category
      bestScore = score
    }
  }

  return best
}
