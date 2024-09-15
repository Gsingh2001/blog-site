// FooterSection.jsx
import Link from 'next/link';
import React from 'react';

const FooterSection = () => {
    return (
        <footer className="bg-gray-800 text-white p-6">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Kuldeep Blogs. All rights reserved.</p>
                <p>Follow us on:
                    <Link href="https://twitter.com" className="ml-2 text-blue-400">Twitter</Link> |
                    <Link href="https://facebook.com" className="ml-2 text-blue-600">Facebook</Link> |
                    <Link href="https://instagram.com" className="ml-2 text-pink-500">Instagram</Link>
                </p>
            </div>
        </footer>
    );
};

export default FooterSection;
