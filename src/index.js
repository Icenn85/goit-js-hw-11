import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const picturesList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox;

function imageMarkup(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
        return `
      <div class="photo-card">
        <a href="${largeImageURL}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <div class="info-item-container">
                <p class="info-item"><b>Likes</b></p>
                <p>${likes}</p>
                </div>
             
        <div class="info-item-container">
        <p class="info-item"><b>Views</b></p>
        <p>  ${views}</p>
        </div>
                <div class="info-item-container">
                <p class="info-item"><b>Comments</b></p>
                <p>${comments}</p>
                </div>
        <div class="info-item-container">
        <p class="info-item"><b>Downloads</b></p>
        <p>${downloads}</p>
        </div>
        </div>
        </div>
      `;
    })
    .join('');

  picturesList.insertAdjacentHTML('beforeend', markup);
}

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearchForm(evt) {
  evt.preventDefault();
  page = 1;
  query = evt.currentTarget.elements.searchQuery.value;
  picturesList.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    Notify.failure('Enter a word for searching');
    return;
  }

  fetchImg(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
         Notify.failure(
           'Sorry, there are no images matching your search query. Please try again.'
         );
      } else {
        imageMarkup(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImg(query, page, perPage)
    .then(({ data }) => {
      imageMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = data.totalHits / perPage;

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
