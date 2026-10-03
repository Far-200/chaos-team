// The existing classifier identifies categories, not individual task IDs.
// Arithmetic already distinguishes expressions through content and eligibility.
// Keep raw task wording for display; it must not influence variant selection.
export function taskIdentity(category, arithmetic) {
  return arithmetic
    ? `${category}:${arithmetic.left}${arithmetic.operator}${arithmetic.right}`
    : category
}
