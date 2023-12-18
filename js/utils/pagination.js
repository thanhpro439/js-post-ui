export function paginationPost(pagination) {
  // bind click event
  const ulPagination = document.getElementById('postsPagination');
  if (!ulPagination) return;

  // calc total pagination
  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  // save page and totalPage to ulPagination
  ulPagination.dataset.page = _page || 1;
  ulPagination.dataset.totalPage = totalPage || 1;

  // check disable pre/next btn
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');
  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function handlePagination({ elementID, queryParams, onChange }) {
  const ulPagination = document.getElementById(elementID);
  if (!ulPagination) return;

  const prev = ulPagination.firstElementChild;
  const next = ulPagination.lastElementChild;
  const postSection = document.getElementById('postList');

  prev.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulPagination.dataset.page);
    if (page <= 1) return;
    onChange?.(page - 1);
    postSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  next.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPagination.dataset.page);
    const totalPage = Number.parseInt(ulPagination.dataset.totalPage);
    if (page >= totalPage) return;
    onChange?.(page + 1);
    postSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
}
