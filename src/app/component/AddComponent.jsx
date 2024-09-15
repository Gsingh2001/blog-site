import Link from 'next/link';
import React from 'react';

const AddComponent = () => {
  return (
    <div className="bg-gray-200 shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Advertise with Us</h2>
      <p className="text-gray-700 text-center mb-4">
        Interested in promoting your products or services? Contact us for advertising opportunities!
      </p>
      <div className="flex justify-center">
        <Link
          href="/contact"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default AddComponent;
