export function updateTextPost(parent, child, text) {
  if (!parent) return;

  const element = parent.querySelector(child);
  if (element) element.textContent = text;
}
