import axios from 'axios';
import postApi from './api/postApi';
import { handlePostForm } from './utils';
import axiosClient from './api/axiosApi';

async function handleSubmitForm(formValue) {
  try {
    console.log('click');
    // Disable Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;

    // call api
    let savePost = formValue.id
      ? await postApi.update(formValue)
      : await postApi.add(formValue);

    // Toast message 

    
    // Enable save button
    if (savePost) saveBtn.disabled = false;

    // redirect to post
    setTimeout(() => {
      if (savePost) window.location.assign(`/post-detail.html?id=${savePost.id}`);
    }, 3000);
  } catch (error) {
    console.log('error', error);
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
