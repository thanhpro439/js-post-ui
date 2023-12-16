import postApi from './api/postApi';
import { updateTextPost } from './utils';

function createPostElement(post) {
  const liElementTemplate = document.querySelector('#postItemTemplate');
  if (!liElementTemplate) return;

  const liElement = liElementTemplate.content.firstElementChild.cloneNode('true');
  if (!liElement) return;

  updateTextPost(liElement, '[data-id="title"]', post.title);
  updateTextPost(liElement, '[data-id="author"]', post.author);
  updateTextPost(liElement, '[data-id="description"', post.description);
  updateTextPost(
    liElement,
    '[data-id="timeSpan"',
    `${new Date(post.createdAt).toLocaleDateString('en-US')} ${new Date(
      post.createdAt,
    ).toLocaleTimeString('en-US')}`,
  );

  const thumb = liElement.querySelector('[data-id="thumbnail"]');
  if (thumb) thumb.src = post.imageUrl;
  
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
