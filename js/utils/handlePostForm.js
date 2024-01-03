import { updateFormField, updateHeroImage, randomIntergerNumber, updateTextPost } from './common';
import { string, object, mixed } from 'yup';

function handleChangeImageBtn(postChangeImage) {
  postChangeImage.addEventListener('click', () => {
    // get a random image
    const randomId = randomIntergerNumber(1000);
    const newUrl = `https://picsum.photos/id/${randomId}/1368/1000`;

    updateHeroImage(newUrl);
  });
}

function setFieldError(form, name, message) {
  const field = form.querySelector(`[name=${name}]`);
  if (field) {
    // mark this form is unvalid
    field.setCustomValidity(message);
    
    // show error
    updateTextPost(field.parentElement, '.invalid-feedback', message);
  }
}

async function validateForm(form, dataForm) {
  const dataObject = object({
    title: string().required('Please enter the title!'),
    author: string().required('Please enter the author!'),
    description: string().required('Please enter the description!'),
    imageMethod: string(),
    imageUrl: string().when('imageMethod', ([imageMethod], imgUrl) => {
      if (imageMethod === 'random') return imgUrl.required('Please choose a cover photo');
    }),
    imageUpload: mixed().when('imageMethod', ([imageMethod], img) => {
      if (imageMethod === 'upload')
        return img
          .test('required', 'Please upload a cover photo!', (value) => Boolean(value.name.length))
          .test(
            'file size',
            'Please upload image smaller than 5MB',
            (value) => value.size <= 5242880,
          );
    }),
  });

  try {
    // reset error
    ['title', 'author', 'description', 'imageUrl', 'imageUpload'].forEach((field) => {
      setFieldError(form, field, '');
    });
    await dataObject.validate(dataForm, {
      abortEarly: false,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      for (const validationError of error.inner) {
        const name = validationError.path;
        setFieldError(form, name, validationError.message);
      }
    }
  }

  const isValid = form.checkValidity();

  isValid ? form.classList.remove('was-validated') : form.classList.add('was-validated');
  return isValid;
}

function handleChangeUploadImage() {
  const methodList = document.querySelectorAll('[name="imageMethod"]');
  const optionList = document.querySelectorAll('.optionInput');
  if (!methodList || !optionList) return;

  methodList.forEach((method, index) => {
    optionList[index].hidden = true;
    if (method.checked) optionList[index].hidden = false;
  });
}

function handleUploadImageInput() {
  const uploadImageInput = document.getElementById('uploadImageFile');

  if (!uploadImageInput) return;

  uploadImageInput.addEventListener('change', () => {
    const file = uploadImageInput.files[0];
    if (!file || !file.name) {
      updateHeroImage('');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    updateHeroImage(imageUrl);
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

  // handleUploadImageInput
  handleUploadImageInput();

  // submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateData = {};

    // get value from field
    const formData = new FormData(form);
    for (const [key, value] of formData) {
      updateData[key] = value;
    }

    // update add/edit timestamp
    const now = new Date();
    updateData['updatedAt'] = Date.parse(now);


    // validate data
    const isValid = await validateForm(form, updateData);
    if (!isValid) return;

    // call onSubmit function
    onSubmit?.(updateData);
  });
}
