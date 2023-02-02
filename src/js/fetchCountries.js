
const countriesMainLink = 'https://restcountries.com/v3.1/name/';
const countriesInfo = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${countriesMainLink}${name}?${countriesInfo}`)
       .then(response => response.json())
    .catch(err => console.log(err));
}
