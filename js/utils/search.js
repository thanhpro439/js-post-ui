import debounce from 'lodash.debounce';

export function handleSearch({ elementID, queryParams, onChange }) {
  const searchInput = document.getElementById(elementID);
  if (!searchInput) return;

  // update title_like to search box if has;
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }
  const debounceSearch = debounce((e) => onChange?.(e.target.value), 500);

  searchInput.addEventListener('input', debounceSearch);
}
