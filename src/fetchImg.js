import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api';
const MY_KEY = '29842257-f781ca2767b35dbb86ba2fb42';

async function fetchImg(query, page, perPage) {
  const response = await axios.get(
    `${BASE_URL}?key=${MY_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}

export { fetchImg };
