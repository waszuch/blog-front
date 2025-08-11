import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

// Axios configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'author';
}

export interface LoginResponse extends User {
  token: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Token interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token found and added to request');
  } else {
    console.log('No token found');
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized, clearing token');
      Cookies.remove('token');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('Attempting login for:', email);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string, role?: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      console.log('GetMe response:', response.data);
      return response.data;
    } catch (error) {
      console.error('GetMe error:', error);
      throw error;
    }
  },
};

export const postsAPI = {
  getAll: async (page = 1, limit = 10, category?: string, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/posts/slug/${slug}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  
  create: async (postData: Partial<Post>) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  update: async (id: string, postData: Partial<Post>) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  
  create: async (categoryData: Partial<Category>) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  update: async (id: string, categoryData: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default api;