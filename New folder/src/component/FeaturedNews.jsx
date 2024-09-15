import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database'; // Firebase database imports
import { database } from '../../firebase'; // Import Firebase database from your configuration


function FeaturedNews() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNewsItems() {
      try {
        // Reference to the 'articles' node in Firebase Realtime Database
        const articlesRef = ref(database, 'blogPosts');
        const snapshot = await get(articlesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert data to an array of news items
          const newsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setNewsItems(newsArray);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsItems();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid pt-5 mb-3">
      <div className="">
        <div className="section-title">
          <h4 className="m-0 text-uppercase font-weight-bold">Featured News</h4>
        </div>
        <Slider {...settings}>
          {newsItems.map((item) => (
            <div key={item.id} className="position-relative overflow-hidden" style={{ height: '300px' }}>
              <Link to={`/blog/${item.id}`}>
                <img
                  className="img-fluid h-100"
                  src={item.main_image} // Ensure `main_image` is the full URL
                  alt={`news-${item.id}`}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
                <div className="overlay">
                  <div className="mb-2">
                    <a
                      className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2"
                      href="#"
                    >
                      {item.category}
                    </a>
                    <a className="text-white" href="#">
                      <small>{new Date(item.date).toLocaleDateString()}</small>
                    </a>
                  </div>
                  <a
                    className="h6 m-0 text-white text-uppercase font-weight-semi-bold"
                    href="#"
                  >
                    {item.title}
                  </a>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default FeaturedNews;

