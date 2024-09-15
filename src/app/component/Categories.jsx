"use client";
import React from 'react';
import { useUser } from '@/utils/UserContext';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Categories = () => {
  const { cards } = useUser();

  // Group cards by categories
  const groupedByCategory = cards.reduce((acc, card) => {
    card.category.forEach((cat) => {
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(card);
    });
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Categories</h1>

      {/* Loop through each category */}
      {Object.keys(groupedByCategory).map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">{category}</h2>

          {/* Swiper Carousel */}
          <Swiper spaceBetween={16} slidesPerView={1} breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}>
            {groupedByCategory[category].map((card) => (
              <SwiperSlide key={card.id}>
                <Link href={`/blog/${card.id}`}>
                  <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex flex-col">
                    <img
                      src={card.main_image}
                      alt={card.title}
                      className="w-full h-40 object-cover mb-4 rounded"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {card.content.join(' ').slice(0, 100)}...
                    </p>
                    <div className="text-gray-500 text-sm">
                      <span className="mr-2">Date: {card.date}</span>
                      <span>Author: {card.author_name}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default Categories;
