import postApi from './api/postApi';

function updateCurrentValuePost(data, postHeroImage, titleInput, authorInput, desInput) {
  if (!data) return;

  // update exits post detail
  const bgImg = new Image();
  bgImg.src = data.imageUrl;
  postHeroImage.style.backgroundImage = `url(${bgImg.src})`;

  bgImg.onerror = function () {
    postHeroImage.style.backgroundImage = "url('https://placehold.co/600x400?text=Thumbnail')";
  };

  // Update post detail
  if (!titleInput || !authorInput || !desInput) return;

  titleInput.value = data.title;
  authorInput.value = data.author;
  desInput.value = data.description;
  postHeroImage.dataset.bg = data.imageUrl;
}

function handleClickChangeImage(postHeroImage) {
  const changeImageBtn = document.getElementById('postChangeImage');
  if (!changeImageBtn) return;

  const bgImg = new Image();

  changeImageBtn.addEventListener('click', () => {
    const idRandom = Math.floor(Math.random() * 1000); //Random id img from 0 to 1000
    bgImg.src = `https://picsum.photos/id/${idRandom}/1368/1000`;
    postHeroImage.style.backgroundImage = `url(${bgImg.src})`;
    postHeroImage.dataset.bg = bgImg.src;

    bgImg.onerror = function () {
      bgImg.src = 'https://placehold.co/600x400?text=Thumbnail';
      postHeroImage.style.backgroundImage = `url(${bgImg.src})`;
      postHeroImage.dataset.bg = bgImg.src;
    };
  });
}

async function handleSaveBtn(data, postHeroImage, titleInput, authorInput, desInput, saveBtn) {
  if (!saveBtn) return;
  if (data.id) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const now = new Date();
      const updateAt = Date.parse(now);
      const updatedData = {
        id: data.id,
        title: titleInput.value,
        author: authorInput.value,
        description: desInput.value,
        updateAt,
        imageUrl: postHeroImage.dataset.bg,
      };
      postApi.update(updatedData);
    });
  } else {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const now = new Date();
      const updateAt = Date.parse(now);
      const updatedData = {
        id: Math.floor(Math.random() * 10000000000000000), // Generate uid,
        title: titleInput.value,
        author: authorInput.value,
        description: desInput.value,
        updateAt,
        imageUrl: postHeroImage.dataset.bg,
      };
      postApi.add(updatedData);
    });
  }
}

(async () => {
  try {
    const postHeroImage = document.getElementById('postHeroImage');
    const titleInput = document.getElementById('postInputTitle');
    const authorInput = document.getElementById('postInputAuthor');
    const desInput = document.getElementById('postInputDescription');
    const saveBtn = document.getElementById('saveBtn');

    const url = new URL(window.location);
    const id = url.searchParams.get('id');
    if (id) {
      const data = await postApi.getById(url.searchParams.get('id'));
      updateCurrentValuePost(data, postHeroImage, titleInput, authorInput, desInput);
      handleClickChangeImage(postHeroImage);
      handleSaveBtn(data, postHeroImage, titleInput, authorInput, desInput, saveBtn);
    }
    if (!id) {
      const newData = {};
      handleClickChangeImage(postHeroImage);
      handleSaveBtn(newData, postHeroImage, titleInput, authorInput, desInput, saveBtn);
    }
  } catch (error) {
    console.log('Error', error);
  }
})();
