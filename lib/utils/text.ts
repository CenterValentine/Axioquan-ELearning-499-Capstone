/**
 * Truncate text to a specified number of sentences
 * @param text - The text to truncate
 * @param maxSentences - Maximum number of sentences to keep (default: 2)
 * @returns Truncated text with "..." appended if truncated
 */
export function truncateDescription(
  text: string,
  maxSentences: number = 2
): string {
  if (!text) return "";
  // Remove HTML tags for sentence detection
  const plainText = text.replace(/<[^>]*>/g, "");
  const sentences = plainText
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  if (sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(" ") + "...";
}

