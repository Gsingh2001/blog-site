"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchData } from '@/utils/fetchData';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FirebaseData';

const UserContext = createContext();

// Custom hook to use the UserContext
export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Track loading state for auth and data fetching

  // Fetch card data on component mount
  useEffect(() => {
    const getCards = async () => {
      try {
        const data = await fetchData();  // Fetch cards using Firebase
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    getCards();
  }, []);

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Update user state when authentication state changes
      setLoading(false);  // Set loading to false when auth state is determined
    });

    return () => unsubscribe();  // Cleanup the listener on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading state while waiting for auth and data
  }

  return (
    <UserContext.Provider value={{ cards, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
