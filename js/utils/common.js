export function updateTextPost(parent, child, text) {
  if (!parent) return;

  const element = parent.querySelector(child);
  if (element) element.textContent = text;
}

export function truncateText(text, maxlength) {
  if (text.length <= maxlength) return text;

  return `${text.slice(0, maxlength - 1)}…`;
}

export function showModal() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lighboxModal = new bootstrap.Modal(lightbox);
  lighboxModal.show();
}
