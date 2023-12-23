import postApi from './api/postApi';
import { handlePostForm } from './utils';
import * as yup from '/node_modules/.vite/deps/yup.js';

function handleOnSubmit(form) {
  // submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updateData = {};

    // get value from field
    ['title', 'author', 'description'].forEach((field) => {
      updateData[field] = form.querySelector(`[name=${field}]`).value;
    });

    updateData['imageUrl'] = document.getElementById('postHeroImage').getAttribute('data-bg');

    // validate data
    const dataObject = yup.object().shape({
      title: yup.string().required(),
      author: yup.string().required(),
      description: yup.string().required(),
    });

    try {
      await dataObject.validate(updateData, {
        abortEarly: false,
      });
    } catch (error) {

      // show error on log
      // if (!form.checkValidity()) {
      //   console.log('error', error);
      //   e.preventDefault();
      //   e.stopPropagation();
      // }

      form.classList.add('was-validated');
    }
  });
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
      onSubmit: handleOnSubmit,
    });
  } catch (error) {
    console.log('Error', error);
  }
})();

// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function () {
//   'use strict';

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   var forms = document.querySelectorAll('.needs-validation');

//   // Loop over them and prevent submission
//   Array.prototype.slice.call(forms).forEach(function (form) {
//     form.addEventListener(
//       'submit',
//       function (event) {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add('was-validated');
//       },
//       false,
//     );
//   });
// })();
