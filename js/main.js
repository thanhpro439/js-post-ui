import postApi from './api/postApi';

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    const all = await postApi.getAll(queryParams);
    console.log('All data', all);
    const id = await postApi.getById('lea319jollj7y1ql1111');
    console.log('id data', id);
  } catch (error) {
    console.log('Error postApi', error);
  }
}

main();
