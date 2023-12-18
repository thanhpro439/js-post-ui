import postApi from './api/postApi';
import { updateTextPost, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  const { data, pagination } = await postApi.getAll(url.searchParams);

  // re-render post list
  renderPostList(data);
  paginationPost(pagination);
}

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

  // clear old content
  postListElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    postListElement.appendChild(liElement);
  });
}

function paginationPost(pagination) {
  // bind click event
  const ulPagination = document.getElementById('postsPagination');
  if (!ulPagination) return;

  // calc total pagination
  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  // save page and totalPage to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPage = totalPage;

  // check disable pre/next btn
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');
  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

function initQueryParam() {
  const url = new URL(window.location);

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

function handlePagination() {
  const ulPagination = document.getElementById('postsPagination');
  if (!ulPagination) return;

  const prev = ulPagination.firstElementChild;
  const next = ulPagination.lastElementChild;

  prev.addEventListener('click', (e) => {
    e.preventDefault();
    const ulPagination = document.getElementById('postsPagination');
    if (!ulPagination) return;

    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    if (page <= 1) return;

    handleFilterChange('_page', page - 1);
  });

  next.addEventListener('click', (e) => {
    e.preventDefault();
    const ulPagination = document.getElementById('postsPagination');
    if (!ulPagination) return;

    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    const totalPage = Number.parseInt(ulPagination.dataset.totalPage) || 1;
    if (page >= totalPage) return;

    handleFilterChange('_page', page + 1);
  });
}

(async () => {
  try {
    //set default params
    initQueryParam();

    // get params from URL
    const queryParams = new URLSearchParams(window.location.search);

    // Fetch data from API
    const { data, pagination } = await postApi.getAll(queryParams);
    if (!data) return;

    handlePagination();
    renderPostList(data);
    paginationPost(pagination);
  } catch (error) {
    console.log('Error postApi', error);
  }
})();
