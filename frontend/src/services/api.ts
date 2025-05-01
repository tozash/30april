import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('idToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email: string, password: string, confirmPassword: string) => {
    console.log(email, password, confirmPassword);
    const response = await api.post('/auth/register', { email, password, confirmPassword });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    console.log(response.data.idToken);
    localStorage.setItem('idToken', response.data.idToken);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Flashcard API
export const flashcardAPI = {
  getTodayCards: async () => {
    const response = await api.get('/flashcards/today');
    return response.data;
  },
  
  createCard: async (front: string, back: string, hint: string, tags: string[]) => {
    const response = await api.post('/flashcards', { front, back, hint, tags });
    return response.data;
  },
  
  rateCard: async (id: string, feedback: 'easy' | 'hard' | 'wrong') => {
    const response = await api.put(`/flashcards/${id}/${feedback}`);
    return response.data;
  }
};

export default api;
