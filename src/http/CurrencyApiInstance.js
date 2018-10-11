import axios from 'axios';
export default axios.create({
  baseURL: 'https://joms-currency-api.herokuapp.com/'
});