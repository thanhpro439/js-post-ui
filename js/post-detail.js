import dayjs from 'dayjs';
import postApi from './api/postApi';
import { updateTextPost } from './utils';

function updatePostDetail(data) {
  // Update cover picture
  const postHeroImage = document.getElementById('postHeroImage');
  const bgImg = new Image();
  bgImg.src = data.imageUrl;
  postHeroImage.style.backgroundImage = `url(${bgImg.src})`;

  bgImg.onerror = function () {
    postHeroImage.style.backgroundImage = "url('https://placehold.co/600x400?text=Thumbnail')";
  };

  // Update post detail
  updateTextPost(document, '#postDetailTitle', data.title);
  updateTextPost(document, '#postDetailAuthor', data.author);
  updateTextPost(document, '#postDetailDescription', data.description);
  updateTextPost(
    document,
    '#postDetailTimeSpan',
    dayjs(data.updatedAt).format(' - YYYY/MM/DD HH:mm'),
  );
}

function handleClickImage() {
  // get all image
  const imageList = document.querySelectorAll('img[data-album="post-album"]');
  const imgArr = [...imageList];

  let index = 0;

  // get modal 'lightbox'
  const lightbox = document.getElementById('lightbox');
  const lighboxModal = new bootstrap.Modal(lightbox);
  const lightboxImg = lightbox.querySelector('img[data-id="lightboxImg"]');

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.dataset.album === 'post-album') {
      index = imgArr.findIndex((img) => target === img);

      // set image to lightbox and show
      lightboxImg.src = target.src;
      lighboxModal.show();
    }
  });

  // handle pre/next button
  const prevBtn = lightbox.querySelector('button[data-id="lightboxPrev"]');
  const nextBtn = lightbox.querySelector('button[data-id="lightboxNext"]');

  if (!prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    // update index
    index = (index + 2) % 3;
    lightboxImg.src = imgArr[index].src;
    lighboxModal.show();
  });

  nextBtn.addEventListener('click', () => {
    // update index
    index = (index + 1) % 3;
    lightboxImg.src = imgArr[index].src;
    lighboxModal.show();
  });
}

// main
(async () => {
  try {
    handleClickImage();

    //get params
    const url = new URL(window.location);
    const id = url.searchParams.get('id');
    if (!id) {
      console.log('Page not found');
      return;
    }

    // Fetch data from API
    const data = await postApi.getById(id);
    if (!data) return;

    updatePostDetail(data);
  } catch (error) {
    console.log('Error postApi', error);
  }
})();
