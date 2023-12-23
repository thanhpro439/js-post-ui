import { updateFormField, updateHeroImage, randomIntergerNumber } from './common';


function handleChangeImageBtn(postChangeImage) {
  postChangeImage.addEventListener('click', () => {
    // get a random image
    const randomId = randomIntergerNumber(1000);
    const newUrl = `https://picsum.photos/id/${randomId}/1368/1000`;

    updateHeroImage(newUrl);
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
    ['title', 'author', 'description'].forEach((field) => {
      updateFormField(form, field, defaultData);
    });

    // update cover image
    updateHeroImage(defaultData.imageUrl);
  }


  // handlde change cover image
  handleChangeImageBtn(postChangeImage);

  // call onSubmit function
  onSubmit?.(form);
}
