import postApi from './api/postApi';

async function main() {
  const queryParams = {
    _page: 1,
    _limit: 5,
  };
  const all = await postApi.getAll(queryParams);
  console.log('All data', all);
  const id = await postApi.getById('lea319jollj7y1ql');
  console.log('id data', id);

  const id2 = await postApi.getById('lea319jollj7y1ql-test');
  console.log('id2 data', id2);
}

main();
