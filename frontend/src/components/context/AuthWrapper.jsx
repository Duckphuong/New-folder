import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth.context'; // Import the AuthContext

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: '',
            name: '',
            role: '',
            CCCD: '',
            id: '',
            SoLanPhat: '',
        },
    });

    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const storedAuthData = localStorage.getItem('authData');
        console.log('authData', storedAuthData);
        if (storedAuthData) {
            try {
                const parsed = JSON.parse(storedAuthData);
                setAuth({
                    isAuthenticated: true,
                    user: parsed.user,
                });
            } catch (error) {
                console.error('Invalid auth data in localStorage', error);
            }
        }
        setAppLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, appLoading, setAppLoading }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
