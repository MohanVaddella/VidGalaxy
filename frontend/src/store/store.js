import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    auth: {
        username : '',
        active : false,
        enteredUsername: '',
    }, 
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name }})),
    setEnteredUsername: (enteredName) => set((state) => ({ auth: { ...state.auth, enteredUsername: enteredName } })),
}));
