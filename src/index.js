
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';


const searchBox = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onCountrySearchEl, DEBOUNCE_DELAY));

function onCountrySearchEl() {
    const countryName = searchBox.value.trim();
    if (countryName === '') {
        return (list.innerHTML = ''), (info.innerHTML = '');
    }


    fetchCountries(countryName).then(data => {
        list.innerHTML = '';
        info.innerHTML = '';

        if (data.length === 1) {
            info.insertAdjacentHTML('beforeend', displayInfo(data));
        } else if (data.length >= 10) {
            tooManyCountries()
        } else {
            list.insertAdjacentHTML('beforeend', displayList(data));
        }
    }).catch(wrongCountryName);


    function displayList(data) {
        const countryList = data.map(({ name, flags }) => {
            const markUp = `
          <li class="country-list__item">
              <img class="country-list__item__flag" src="${flags.svg}" alt="Flag of ${name.official}">
              <h2 class="country-list__item__name">${name.official}</h2>
          </li>
          `;
            return markUp;
        })
            .join('');
        return countryList;
    }

    function displayInfo(data) {
        const countryInfo = data.map(({ name, flags, capital, population, languages }) => {
            const markUp = `
        <ul class="country-list">
            <li class="country--list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official
                }">
              <h2 class="country-list__name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-list__categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-list__categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-list__categories">Languages: </span>${Object.values(
                    languages,
                ).join(', ')}</li>
        </ul>
        `;
            return markUp;
        })
            .join('');
        return countryInfo;
    }

    function tooManyCountries() {
        Notify.info('Too many matches found. Please enter a more specific name.');
    }

    function wrongCountryName() {
        Notify.failure('Oops, there is no country with that name');
    }
}