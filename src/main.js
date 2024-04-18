import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImages } from './js/pixabay-api.js';
import { hideLoader } from './js/pixabay-api.js';
import { createMarkup } from './js/render-functions.js';

const form = document.querySelector('.form');
const input = document.querySelector('.searchInput');
const list = document.querySelector('.list');
const submitBtn = document.querySelector('.submitBtn');

submitBtn.disabled = true;

input.addEventListener('input', () => {
  if (input.value.trim() !== '') {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const searchInputValue = input.value.trim();
  if (searchInputValue !== '') {
    list.innerHTML = '';
    searchImages(searchInputValue)
      .then(data => {
        if (data.hits.length === 0) {
          hideLoader();
          return iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
            backgroundColor: '#EF4040',
            messageColor: '#fff',
            timeout: 3000,
          });
        } else {
          hideLoader();
          list.insertAdjacentHTML('beforeend', createMarkup(data.hits));
          lightbox.refresh();
        }
        form.reset();
        submitBtn.disabled = true;
      })
      .catch(error => {
        hideLoader();
        return iziToast.error({
          message: `${error}`,
          position: 'topRight',
          backgroundColor: '#EF4040',
          messageColor: '#fff',
          timeout: 3000,
        });
      });
  }
});

const lightbox = new SimpleLightbox('.list a', {
  captionsData: 'alt',
  captionDelay: 250,
});