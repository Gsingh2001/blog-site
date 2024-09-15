import React from 'react';
import { ref, get } from 'firebase/database'; // Firebase database imports
import { database } from '../../../../FirebaseData';
import BlogLayout from './layout';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const ShareButton = dynamic(() => import('@/app/component/ShareButton'), { ssr: false });
const RelatedBlogs = dynamic(() => import('@/app/component/RelatedBlogs'), { ssr: false });
const AddComponent = dynamic(() => import('@/app/component/AddComponent'), { ssr: false });

// Fetch blog post data from Firebase based on ID
async function fetchArticleData(id) {
  const articleRef = ref(database, `blogPosts/${id}`);
  const snapshot = await get(articleRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}

// Component for rendering a single blog post
const SingleNews = async ({ params }) => {
  const { id } = params;
  const articleData = await fetchArticleData(id);

  if (!articleData) {
    return <div className="text-center mt-5">No article found.</div>;
  }

  const { title, date, category, content, images, main_image, author_name, author_avatar } = articleData;

  return (
    <BlogLayout title={title} content={content}>
      <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap">
          {/* Main content area */}
          <div className="lg:w-2/3 w-full mb-8 lg:mb-0">
            <div className="mb-4">
              <img src={main_image} alt="Main" className="w-full h-80 object-cover rounded" />
            </div>

            <div className="bg-gray-200 shadow-md rounded-lg p-6">
              <div className="flex justify-between mb-3">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {category}
                </span>
                <span className="text-gray-500 text-sm">{new Date(date).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{title}</h1>
              {content.length > 0 ? (
                content.map((paragraph, index) => (
                  <p key={index} className="mb-3 text-gray-700">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>No content available.</p>
              )}
              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="text-gray-500 shadow-md rounded-lg overflow-hidden">
                      <img src={img} alt={`News Image ${index + 1}`} className="w-full h-64 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <ShareButton title={title} />
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <img src={author_avatar} alt="Author" className="w-8 h-8 rounded-full border border-gray-300" />
                <span className="text-gray-700 font-semibold">{author_name}</span>
              </div>
            </div>
          </div>

          {/* Right section - Related Blogs */}
          <div className="lg:w-1/3 w-full lg:pl-6">
            <RelatedBlogs category={category} currentBlogId={id} />
            <AddComponent />
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default SingleNews;
