export function createMarkup(arr) {
    return arr
      .map(
        ({
          webformatURL,
          tags,
          largeImageURL,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<li class='card'><a class="gallery-link" href="${largeImageURL}"><img class='image' src='${webformatURL}' alt='${tags}'></a>
          <div class='description'>
          <div class='title-text'><h4 class='title'>Likes</h4><p class='text'>${likes}</p></div>
          <div class='title-text'><h4 class='title'>Views</h4><p class='text'>${views}</p></div>
          <div class='title-text'><h4 class='title'>Comments</h4><p class='text'>${comments}</p>
          </div><div class='title-text'><h4 class='title'>Downloads</h4><p class='text'>${downloads}</p></div>
          </div></li>`
      )
      .join('');
  }