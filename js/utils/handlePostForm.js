import { updateFormField, updateHeroImage, randomIntergerNumber } from './common';
import { string, object } from 'yup';

function handleChangeImageBtn(postChangeImage) {
  postChangeImage.addEventListener('click', () => {
    // get a random image
    const randomId = randomIntergerNumber(1000);
    const newUrl = `https://picsum.photos/id/${randomId}/1368/1000`;

    updateHeroImage(newUrl);
  });
}

async function validateForm(form, dataForm) {
  const dataObject = object({
    title: string().required(),
    author: string().required(),
    description: string().required(),
    imageUrl: string().url().required('Please add cover photo.'),
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

function handleChangeUploadImage() {
  const methodList = document.querySelectorAll('[name="flexRadioImage"]');
  const optionList = document.querySelectorAll('.optionInput');
  if (!methodList || !optionList) return;

  // for (let index = 0; index < methodList.length; index++) {
  //   methodList[index] ? (optionList[index].hidden = false) : (optionList[index].hidden = true);
  // }

  methodList.forEach((method, index) => {
    optionList[index].hidden = true;
    if (method.checked) optionList[index].hidden = false;
  });
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

  // handle choose cover photo
  const selectImage = document.getElementById('selectImage');
  selectImage.addEventListener('change', handleChangeUploadImage);

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
