import axios from 'axios';

// Instância do Axios com a URL do back-end
export const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor para colocar o token JWT direto no cabeçalho de toda requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@Mensagens:token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});