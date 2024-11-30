import {create} from 'zustand'
import axios from 'axios'

const API_URI = `${import.meta.env.VITE_SERVER_URL.replace(/\/$/, "")}/api/auth`;


axios.defaults.withCredentials = true

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isChecking: true,
    message: null,

    signup: async (email, password, name) => {

        set({isLoading: true, error: null});

        try {

            const response = await axios.post(`${API_URI}/signup`, {email, password, name});

            set({ user: response.data.user, isAuthenticated: true, isLoading: false});
            
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {

        set({isLoading: true, error: null});

        try {

            const response = await axios.post(`${API_URI}/login`, {email, password});

            set({ user: response.data.user, isAuthenticated: true, isLoading: false});
            
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code)=> {

        set({ isLoading: true, error: null });

        try {

            const response = await axios.post(`${API_URI}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });

            return response.data
            
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {

        //for cehcing loading spinner
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        set({ isChecking: true, error: null });

        try {

            const response = await axios.get(`${API_URI}/check-auth`);

            set({ user: response.data.user, isAuthenticated: true, isChecking: false });
            
        } catch (error) {

            set({ error: null, isChecking: false, isAuthenticated: false });
            
        }
    },

    logout: async () => {

        set({ isLoading: true, error: null });

        try {

            await axios.post(`${API_URI}/logout`);

            set({ user: null, isAuthenticated: false, isLoading: false });

        } catch (error) {
            set({ error: error.response.data.message || "Error logging out", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {

        set({ isLoading: true, error: null });

        try {

            const response = await axios.post(`${API_URI}/forgot-password`, {email});

            set({ user: response.data.user, isLoading: false });
            
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password",
            })
            throw error;
            
        }

    },

    resetPassword: async (token, password) => {

        set({ isLoading: true, error: null});

        try {

            const response = await axios.post(`${API_URI}/reset-password/${token}`, {password});

            set({message: response.data.message, isLoading: false});
            
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password" });
            throw error;
            
        }
    }


}))