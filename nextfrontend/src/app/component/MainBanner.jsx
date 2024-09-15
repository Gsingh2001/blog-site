"use client";
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import Link from 'next/link';
import { database } from '../../../FirebaseData';

function MainBanner() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesRef = ref(database, 'blogPosts');
        const snapshot = await get(articlesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const articlesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setArticles(articlesArray);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Left Section</h2>
            <p>This is the content of the left section. You can add images, text, or other elements here.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4">Right Section</h2>
            <p>This is the content of the right section. You can add images, text, or other elements here.</p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default MainBanner;
