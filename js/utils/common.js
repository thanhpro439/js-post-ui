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

export function updateFormField(form, field, data) {
  const f = form.querySelector(`[name=${field}]`);
  if (!f) return;
  f.value = data[field];
}

export function updateHeroImage(urlImg) {
  const heroImage = document.getElementById('postHeroImage');
  const inputImage = document.getElementById('postInputImageCover');
  if (!heroImage || !inputImage) return;

  const bgImg = new Image();
  bgImg.src = Boolean(urlImg) ? urlImg : '';
  inputImage.value = Boolean(urlImg) ? urlImg : '';
  heroImage.style.backgroundImage = `url(${bgImg.src})`;

  bgImg.onerror = function () {
    heroImage.style.backgroundImage = "url('https://placehold.co/600x400?text=Thumbnail')";
  };
}

export function randomIntergerNumber(max) {
  return Math.floor(Math.random() * max);
}
