import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    auth: {
        username : localStorage.getItem('username') || '',
        active : false,
        enteredUsername: '',
    }, 
    setUsername: (name) => {
        localStorage.setItem('username', name); // Save username to localStorage
        set((state) => ({ auth: { ...state.auth, username: name } }));
    },
    setEnteredUsername: (enteredName) => set((state) => ({ auth: { ...state.auth, enteredUsername: enteredName } })),
}));
