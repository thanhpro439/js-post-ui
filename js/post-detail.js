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
  const postTitle = document.querySelector('.post-title-wrapper');
  updateTextPost(postTitle, '#postDetailTitle', data.title);
  updateTextPost(postTitle, '#postDetailAuthor', data.author);
  updateTextPost(
    postTitle,
    '#postDetailTimeSpan',
    dayjs(data.updatedAt).format(' - YYYY/MM/DD HH:mm'),
  );
}

// main
(async () => {
  try {
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
