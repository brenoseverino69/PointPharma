import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.139.75.47:5000/api',
    timeout: 10000
});

export default api;