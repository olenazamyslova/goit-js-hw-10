import refs from './elementRefs';
import FetchImages from './fetchImages';
import ElementControl from './elementControl';
import createHTML from './crateHTML';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');
const fetcher = new FetchImages();
const searchBtn = new ElementControl(refs.searchBtn);
const loadMoreBtn = new ElementControl(refs.loadMoreBtn);
const messageAboutEnd = new ElementControl(refs.messageAboutEnd);

let data;

refs.form.addEventListener('submit', searchImage);
refs.loadMoreBtn.addEventListener('click', getImages);

async function searchImage(event) {
    event.preventDefault();
    const query = refs.form.searchQuery.value.trim();
    if (query) {
        searchBtn.toggleIcon().disable();
        clearGallery();
        fetcher.query = query;
        await getImages();
        searchBtn.toggleIcon().enable();
    }
}

function clearGallery() {
    messageAboutEnd.hide();
    loadMoreBtn.hide();
    refs.gallery.innerHTML = '';
}

async function getImages() {
    loadMoreBtn.toggleIcon().disable();
    loadMoreBtn.setText('Loading');
    try {
        data = await fetcher.fetch();
    } catch (error) {
        console.log('ERROR = ', error);
    }
    if (data.totalHits) {
        renderGallery(data.hits);
        loadMoreBtn.setText('Load more');
        loadMoreBtn.toggleIcon().enable();
        if (fetcher.page === 2) {
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
        } else {
            window.scrollBy({
                top: window.innerHeight - 168,
                behavior: 'smooth',
            });
        }
        if (data.isEnd) {
            messageAboutEnd.show();
            loadMoreBtn.hide();
        }
    } else {
        Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
    }
}

function renderGallery(data) {
    refs.gallery.insertAdjacentHTML('beforeend', createHTML(data));
    loadMoreBtn.show();
    lightbox.refresh();
}
