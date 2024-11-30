import axios from 'axios';

export const httpClient = axios.create({
    baseURL: 'http://10.189.131.22', // Replace with your backend URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
