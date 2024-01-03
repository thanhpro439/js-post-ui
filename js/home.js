import postApi from './api/postApi';
import { handlePagination, handleSearch, paginationPost, renderPostList, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);

  if (filterName) url.searchParams.set(filterName, filterValue);

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
      window.location.assign(`/post-detail.html?id=${postID}`);
    });

    // bind click event for edit/delete post icon
    const editBtn = li.querySelector('[data-id="edit"]');
    if (!editBtn) return;

    editBtn.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${postID}`);
    });

    const removeBtn = li.querySelector('[data-id="remove"]');
    if (!removeBtn) return;

    removeBtn.addEventListener('click', async (e) => {
      try {
        if (window.confirm('Are you sure to remove this post?')) {
          await postApi.remove(postID);
          await handleFilterChange();
          toast.success('Remove post successfully!');
        }
      } catch (error) {
        toast.error(error.message);
      }
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
