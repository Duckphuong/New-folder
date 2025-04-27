// auth.context.js
import { createContext } from 'react';

// Create and export the AuthContext
export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: '',
        name: '',
        role: '',
        CCCD: '',
        id: '',
        SoLanPhat: '',
    },
    appLoading: true,
});
