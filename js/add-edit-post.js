import postApi from './api/postApi';
import { handlePostForm } from './utils';

(async () => {
  try {
    const url = new URL(window.location);
    const id = url.searchParams.get('id');
    const defaultData = id
      ? await postApi.getById(url.searchParams.get('id'))
      : {
          title: '',
          author: '',
          description: '',
        };

    handlePostForm({
      formId: 'postForm',
      defaultData,
      onSubmit: function (formValue) {
        console.log('Form value', formValue);
      },
    });
  } catch (error) {
    console.log('Error', error);
  }
})();
