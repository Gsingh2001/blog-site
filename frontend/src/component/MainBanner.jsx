import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database'; // Import Firebase database functions
import { database } from '../../FirebaseData'; // Import Firebase database from your configuration

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
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-7 px-0">
          <div className="owl-carousel main-carousel position-relative">
            {articles.length > 0 && (
              <div className="position-relative overflow-hidden" style={{ height: '500px' }}>
                <Link to={`/blog/${articles[0].id}`}>
                  <img
                    className="img-fluid h-100"
                    src={articles[0].main_image}
                    style={{ objectFit: 'cover' }}
                    alt="Main Banner"
                  />
                  <div className="overlay">
                    <div className="mb-2">
                      <a className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" href="">
                        {articles[0].category}
                      </a>
                      <a className="text-white" href="">
                        {articles[0].date}
                      </a>
                    </div>
                    <a className="h2 m-0 text-white text-uppercase font-weight-bold" href="">
                      {articles[0].title}
                    </a>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-5 px-0">
          <div className="row mx-0">
            {articles.slice(1, 5).map((article, index) => (
              <div className="col-md-6 px-0" key={article.id}>
                <Link to={`/blog/${article.id}`}>
                  <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                    <img
                      className="img-fluid w-100 h-100"
                      src={article.main_image}
                      style={{ objectFit: 'cover' }}
                      alt={`News ${index + 1}`}
                    />
                    <div className="overlay">
                      <div className="mb-2">
                        <a className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" href="">
                          {article.category}
                        </a>
                        <a className="text-white" href="">
                          <small>{article.date}</small>
                        </a>
                      </div>
                      <a className="h6 m-0 text-white text-uppercase font-weight-semi-bold" href="">
                        {article.title}
                      </a>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
