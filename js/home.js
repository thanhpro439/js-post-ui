import postApi from './api/postApi';
import { handlePagination, handleSearch, paginationPost, renderPostList } from './utils';

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);

  // reset page to 1 if use searching function
  if (filterName === 'title_like') {
    url.searchParams.set('_page', 1);
  }

  history.pushState({}, '', url);

  // fetch API
  const { data, pagination } = await postApi.getAll(url.searchParams);

  // re-render post list
  renderPostList(data);
  paginationPost(pagination);
  handleClickPost();
}

function setDefaultQueryParam() {
  const url = new URL(window.location);

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);

  return url.searchParams;
}

function handleClickPost() {
  // get post list
  const liElements = document.querySelectorAll('#postList > li');
  if (!liElements) return;

  // bind click event for posts
  liElements.forEach((li) => {
    // get id of this post
    const postID = li.dataset.id;

    li.addEventListener('click', (e) => {
      // prevent bubbling click
      const postitemmenu = li.querySelector('[data-id="postitemmenu"]');

      if (postitemmenu && postitemmenu.contains(e.target)) return;
      window.open(`/post-detail.html?id=${postID}`, '_blank');
    });

    // bind click event for edit/delete post
    const editBtn = li.querySelector('[data-id="edit"]');
    if (!editBtn) return;

    editBtn.addEventListener('click', () => {
      window.open(`/add-edit-post.html?id=${postID}`, '_blank');
    });
  });
}

(async () => {
  try {
    //set default params
    const queryParams = setDefaultQueryParam();

    // Fetch data from API
    const { data, pagination } = await postApi.getAll(queryParams);
    if (!data) return;

    handleSearch({
      elementID: 'searchInput',
      queryParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handlePagination({
      elementID: 'postsPagination',
      queryParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    renderPostList(data);

    paginationPost(pagination);

    handleClickPost();
  } catch (error) {
    console.log('Error postApi', error);
  }
})();
