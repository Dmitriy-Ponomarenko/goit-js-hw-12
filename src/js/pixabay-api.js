const loader = document.querySelector('.loader');

export function hideLoader() {
  loader.classList.add('visually-hidden');
}

export function searchImages(searchInput) {
  const API_KEY = '43234755-a337228de2a5121df872aa78d';

  const params = new URLSearchParams({
    key: API_KEY,
    q: searchInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 18,
  });

  loader.classList.remove('visually-hidden');
  return fetch(`https://pixabay.com/api/?${params}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}