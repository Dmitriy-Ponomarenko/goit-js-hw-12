import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImages } from './js/pixabay-api.js';
import { toggleLoader } from './js/pixabay-api.js';
import { toggleLoader2 } from './js/pixabay-api.js';
import { createMarkup } from './js/render-functions.js';

const form = document.querySelector('.form');
const input = document.querySelector('.searchInput');
const list = document.querySelector('.list');
const submitBtn = document.querySelector('.submitBtn');
const loadMore = document.querySelector('.loadMore');
const page = { currentPage: 1 };
submitBtn.disabled = true;

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? data : null;
}

input.addEventListener('input', () => {
  if (input.value.trim() !== '') {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

form.addEventListener('submit', handleClick);
loadMore.addEventListener('click', loadClick);

async function handleClick(event) {
  event.preventDefault();
  const searchInputValue = input.value.trim();
  page.currentPage = 1;
  if (searchInputValue !== '') {
    list.innerHTML = '';
    hideLoadMore();
    saveToLocalStorage('searchInputValue', searchInputValue);
    try {
      const response = await searchImages(searchInputValue, page);
      if (response.data.hits.length === 0) {
        toggleLoader();
        showErrorToast(
          'Sorry, there are no images matching your search query. Please try again!'
        );
      } else {
        toggleLoader();
        list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
        lightbox.refresh();
        const totalPages = Math.ceil(
          response.data.totalHits / response.config.params.per_page
        );
        checkImageLoad(response, totalPages);
      }
      form.reset();
      submitBtn.disabled = true;
    } catch (error) {
      toggleLoader();
      showErrorToast(`${error}`);
    }
  }
}

async function loadClick() {
  hideLoadMore();
  const searchInputValue = getFromLocalStorage('searchInputValue');
  try {
    const response = await searchImages(searchInputValue, page);
    const totalPages = Math.ceil(
      response.data.totalHits / response.config.params.per_page
    );
    toggleLoader2();
    list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
    lightbox.refresh();
    scroll();
    checkImageLoad(response, totalPages);
  } catch (error) {
    toggleLoader2();
    showErrorToast(`${error}`);
  }
}

function scroll() {
  const card = list.firstElementChild;
  const height = card.getBoundingClientRect().height;
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

function showErrorToast(message) {
  iziToast.error({
    message: message,
    position: 'topRight',
    backgroundColor: '#EF4040',
    messageColor: '#fff',
    timeout: 3000,
  });
}

function showWarningToast() {
  iziToast.warning({
    position: 'topRight',
    backgroundColor: '#00A36C',
    message: "We're sorry, but you've reached the end of search results.",
  });
}

function showLoadMore() {
  loadMore.classList.remove('visually-hidden');
}

function hideLoadMore() {
  loadMore.classList.add('visually-hidden');
}

function checkImageLoad(response, totalPages) {
  const checkImagesInterval = setInterval(() => {
    const images = list.querySelectorAll('img');
    const allImagesLoaded = [...images].every(img => img.complete);
    if (allImagesLoaded) {
      clearInterval(checkImagesInterval);
      if (response.config.params.page >= totalPages) {
        return showWarningToast();
      } else {
        showLoadMore();
      }
    }
  }, 50);
}

const lightbox = new SimpleLightbox('.list a', {
  captionsData: 'alt',
  captionDelay: 250,
});
