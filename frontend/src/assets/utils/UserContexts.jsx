import React, { createContext, useState, useEffect } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component to manage the user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On component mount, check if the user data is stored in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Return the provider, passing the user and setUser as context values
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
