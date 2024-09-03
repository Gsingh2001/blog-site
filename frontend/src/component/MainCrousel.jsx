// src/components/MainCarousel.jsx
import React, { useEffect, useState } from 'react';

const MainCarousel = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://172.16.0.2:3000/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-7 px-0">
          <div className="owl-carousel main-carousel position-relative">
            {blogs.slice(0, 3).map(blog => (
              <div key={blog.id} className="position-relative overflow-hidden carousel-item">
                <img className="img-fluid h-100" src="img/news-800x500-1.jpg" alt={blog.title} />
                <div className="overlay">
                  <div className="mb-2">
                    <a className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" href="#">
                      {blog.tags.join(', ')}
                    </a>
                    <a className="text-white" href="#"><small>{new Date(blog.date).toDateString()}</small></a>
                  </div>
                  <a className="h2 m-0 text-white text-uppercase font-weight-bold" href="#">
                    {blog.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5 px-0">
          <div className="row mx-0">
            {blogs.slice(3).map(blog => (
              <div key={blog.id} className="col-md-6 px-0">
                <div className="position-relative overflow-hidden small-item">
                  <img className="img-fluid w-100 h-100" src="img/news-700x435-1.jpg" alt={blog.title} />
                  <div className="overlay">
                    <div className="mb-2">
                      <a className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" href="#">
                        {blog.tags.join(', ')}
                      </a>
                      <a className="text-white" href="#"><small>{new Date(blog.date).toDateString()}</small></a>
                    </div>
                    <a className="h6 m-0 text-white text-uppercase font-weight-semi-bold" href="#">
                      {blog.title}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCarousel;
