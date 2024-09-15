// components/MainBanner.jsx
"use client";
import { useUser } from '@/utils/UserContext';
import Link from 'next/link';
import React from 'react';

function MainBanner() {
  const { cards } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Latest Blog Posts
        </h1>
        <p className="text-gray-600 mt-2">
          Discover the latest insights, stories, and ideas from our blog.
        </p>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 mb-4 lg:mb-0 lg:pr-4">
          {cards.slice(0, 2).map((card, index) => (
            <Link href={`/blog/${card.id}`} key={card.id || index}>
              <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex flex-col">
                <img
                  src={card.main_image}
                  alt={card.title}
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
                <p className="text-gray-700 mb-2 flex-grow">
                  {card.content.join(' ')}
                </p>
                <div className="text-gray-500 text-sm mb-2">
                  <span className="mr-2">Categories: {card.category.join(', ')}</span>
                  <span className="mr-2">Date: {card.date}</span>
                  <span>Author: {card.author_name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.slice(2, 6).map((card) => (
              <Link href={`/blog/${card.id}`} key={card.id}>
                <div className="bg-gray-200 shadow-lg rounded-lg p-4 flex flex-col">
                  <img
                    src={card.main_image}
                    alt={card.title}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-2 flex-grow">
                    {card.content.join(' ')}
                  </p>
                  <div className="text-gray-500 text-sm mb-2">
                    <span className="mr-2">Categories: {card.category.join(', ')}</span>
                    <span className="mr-2">Date: {card.date}</span>
                    <span>Author: {card.author_name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
