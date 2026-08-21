/**
 * Trims text to a meta-description-friendly length at a word boundary
 * (search engines and social previews cut off mid-word otherwise, which
 * reads as broken rather than intentionally trimmed).
 */
export function truncateForMeta(text: string, maxLength = 160): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  const cut = normalized.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}
