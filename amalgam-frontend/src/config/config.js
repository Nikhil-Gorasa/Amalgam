const isDevelopment = window.location.hostname === 'localhost';

export const API_BASE_URL = isDevelopment 
    ? 'http://localhost:8080'
    : 'https://amalgam.onrender.com'; 