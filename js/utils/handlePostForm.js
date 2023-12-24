import { updateFormField, updateHeroImage, randomIntergerNumber } from './common';
import * as yup from '/node_modules/.vite/deps/yup.js';

function handleChangeImageBtn(postChangeImage) {
  postChangeImage.addEventListener('click', () => {
    // get a random image
    const randomId = randomIntergerNumber(1000);
    const newUrl = `https://picsum.photos/id/${randomId}/1368/1000`;

    updateHeroImage(newUrl);
  });
}

async function validateForm(form, dataForm) {
  const dataObject = yup.object().shape({
    title: yup.string().required(),
    author: yup.string().required(),
    description: yup.string().required(),
    imageUrl: yup.string().url().required('Please add cover photo.'),
  });

  try {
    await dataObject.validate(dataForm, {
      abortEarly: false,
    });
  } catch (error) {
    form.classList.add('was-validated');
    return;
  }
}

export function handlePostForm({ formId, defaultData, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  const postChangeImage = form.querySelector('#postChangeImage');
  if (!postChangeImage) return;

  // enter edit mode
  if (defaultData.id) {
    // update field
    ['title', 'author', 'description', 'imageUrl'].forEach((field) => {
      updateFormField(form, field, defaultData);
    });

    // update cover image
    updateHeroImage(defaultData.imageUrl);
  }

  // handlde change cover image
  handleChangeImageBtn(postChangeImage);

  // submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateData = defaultData;

    // get value from field
    ['title', 'author', 'description', 'imageUrl'].forEach((field) => {
      updateData[field] = form.querySelector(`[name=${field}]`).value;
    });

    // update add/edit timestamp
    const now = new Date();
    updateData['updatedAt'] = Date.parse(now);

    // validate data
    await validateForm(form, updateData);
    const isValid = form.checkValidity();
    if (!isValid) return;

    // call onSubmit function
    onSubmit?.(updateData);
  });
}
