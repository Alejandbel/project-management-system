import axios from './axios';

export const authService = {
  signUp: async (data: { name: string, password: string, email: string }) => {
    await axios.post('/auth/sign-up', data);
  },

  signIn: async (data: { email: string, password: string }) => {
    await axios.post('/auth/sign-in', data);
  },

  signOut: async () => {
    await axios.post('/auth/sign-out');
  },
};
