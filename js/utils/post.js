import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { truncateText, updateTextPost } from './common';

// to use fromNow function
dayjs.extend(relativeTime);

export function createPostElement(post) {
  const liElementTemplate = document.querySelector('#postItemTemplate');
  if (!liElementTemplate) return;

  const liElement = liElementTemplate.content.firstElementChild.cloneNode('true');
  if (!liElement) return;

  // update post detail
  updateTextPost(liElement, '[data-id="title"]', post.title);
  updateTextPost(liElement, '[data-id="author"]', post.author);
  updateTextPost(liElement, '[data-id="description"', truncateText(post.description, 100));
  updateTextPost(liElement, '[data-id="timeSpan"', ` - ${dayjs(post.updatedAt).fromNow()}`);

  // set ID for li element
  liElement.dataset.id = post.id;

  const thumb = liElement.querySelector('[data-id="thumbnail"]');
  if (thumb) {
    thumb.src = post.imageUrl;
    thumb.addEventListener('error', () => {
      thumb.src = 'https://placehold.co/600x400?text=Thumbnail';
    });
  }

  return liElement;
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const postListElement = document.querySelector('#postList');
  if (!postListElement) return;

  // clear old content
  postListElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    postListElement.appendChild(liElement);
  });
}

export function updatePostDetail(data) {
  // Update cover picture
  const postHeroImage = document.getElementById('postHeroImage');
  const bgImg = new Image();
  bgImg.src = data.imageUrl;
  postHeroImage.style.backgroundImage = `url(${bgImg.src})`;

  bgImg.onerror = function () {
    postHeroImage.style.backgroundImage = "url('https://placehold.co/600x400?text=Thumbnail')";
  };

  // Update post detail
  updateTextPost(document, '#postDetailTitle', data.title);
  updateTextPost(document, '#postDetailAuthor', data.author);
  updateTextPost(document, '#postDetailDescription', data.description);
  updateTextPost(
    document,
    '#postDetailTimeSpan',
    dayjs(data.updatedAt).format(' - YYYY/MM/DD HH:mm'),
  );
}
