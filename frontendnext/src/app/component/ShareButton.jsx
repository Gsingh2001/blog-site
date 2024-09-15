// ShareButton.jsx
'use client';

import React from 'react';

const ShareButton = ({ title }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this article: ${title}`,
        url: window.location.href,
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('Your browser does not support sharing.');
    }
  };

  return (
    <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
      Share This Article
    </button>
  );
};

export default ShareButton;
