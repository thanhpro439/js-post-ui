import postApi from './api/postApi';
import { handlePostForm, toast } from './utils';

async function handleSubmitForm(formValue) {
  try {
    // Disable Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Saving';

    // call api
    let savePost = formValue.id
      ? await postApi.update(formValue)
      : await postApi.add(formValue);

    // Toast message
    toast.success('Saved post successfully!');

    // Enable save button
    if (savePost) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Save';
    }

    // redirect to post
    setTimeout(() => {
      if (savePost)
        window.location.assign(`/post-detail.html?id=${savePost.id}`);
    }, 4000);
  } catch (error) {
    toast.error(`Error: ${error}`);
  }
}

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
      onSubmit: handleSubmitForm,
    });
  } catch (error) {
    console.log('Error', error);
  }
})();
