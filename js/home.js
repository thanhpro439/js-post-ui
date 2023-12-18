import postApi from './api/postApi';
import { updateTextPost, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function createPostElement(post) {
  const liElementTemplate = document.querySelector('#postItemTemplate');
  if (!liElementTemplate) return;

  const liElement = liElementTemplate.content.firstElementChild.cloneNode('true');
  if (!liElement) return;

  updateTextPost(liElement, '[data-id="title"]', post.title);
  updateTextPost(liElement, '[data-id="author"]', post.author);
  updateTextPost(liElement, '[data-id="description"', truncateText(post.description, 100));

  updateTextPost(liElement, '[data-id="timeSpan"', ` - ${dayjs(post.updatedAt).fromNow()}`);

  const thumb = liElement.querySelector('[data-id="thumbnail"]');
  if (thumb) {
    thumb.src = post.imageUrl;
    thumb.addEventListener('error', () => {
      thumb.src = 'https://placehold.co/600x400?text=Thumbnail';
    });
  }

  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const postListElement = document.querySelector('#postList');
  if (!postListElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    postListElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    const { data, pagination } = await postApi.getAll(queryParams);
    if (!data) return;

    renderPostList(data);
  } catch (error) {
    console.log('Error postApi', error);
  }
})();
