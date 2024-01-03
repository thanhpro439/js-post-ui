import postApi from './api/postApi';
import { handlePostForm, toast } from './utils';

function removeUnnecessaryValue(formValue) {
  const payload = { ...formValue };

  // remove unnecessary field
  if (payload.imageMethod === 'random') delete payload.image;
  else delete payload.imageUrl;

  // remove image method
  delete payload.imageMethod;

  // remove id if not exsis
  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handleSubmitForm(formValue) {
  try {
    const payload = removeUnnecessaryValue(formValue);
    console.log({ payload, formValue });
    const formData = jsonToFormData(payload);

    // Disable Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Saving';

    // call api
    let savePost = payload.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // Toast message
    toast.success('Saved post successfully!');

    // Enable save button
    if (savePost) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Save';
    }

    // redirect to post
    setTimeout(() => {
      if (savePost) window.location.assign(`/post-detail.html?id=${savePost.id}`);
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
