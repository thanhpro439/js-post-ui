export function updateTextPost(parent, child, text) {
  if (!parent) return;

  const element = parent.querySelector(child);
  if (element) element.textContent = text;
}

export function truncateText(text, maxlength) {
  if (text.length <= maxlength) return text;

  return `${text.slice(0, maxlength - 1)}…`;
}
