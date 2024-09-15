import React from 'react';
import Image from 'next/image';
import IMG from '../../assests/auth.jpg'

const ImageSide = () => {
    return (
        <div className="hidden lg:block lg:w-1/2 bg-gray-200 relative">
            <Image
                src={IMG}
                alt="Auth Image"
                layout="fill" // Makes the image fill the container
                objectFit="cover" // Ensures the image covers the container while maintaining aspect ratio
                className="absolute inset-0"
            />
        </div>
    );
};

export default ImageSide;
