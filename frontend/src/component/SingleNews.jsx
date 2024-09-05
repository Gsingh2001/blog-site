import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SingleNews() {
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    // Fetch article data from API
    axios.get(`https://blog-site-1emf.onrender.com/article/${id}`)
      .then(response => {
        setArticleData(response.data);
      })
      .catch(error => {
        console.error('Error fetching article:', error);
      });
  }, [id]);

  if (!articleData) {
    return <p>Loading...</p>;
  }

  const { title, date, category, content, images, main_image, author_name, author_avatar } = articleData;

  return (
    <Container fluid className="position-relative mb-3">
      <img
        className="img-fluid w-100"
        src={`https://blog-site-1emf.onrender.com/${main_image}`}
        style={{ objectFit: 'cover' }}
        alt="Main"
      />
      <div className="bg-white border border-top-0 p-4">
        <div className="mb-3">
          <a className="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" href="#">
            {category}
          </a>
          <a className="text-body" href="#">
            {new Date(date).toLocaleDateString()} {/* Format date */}
          </a>
        </div>
        <h1 className="mb-3 text-secondary text-uppercase font-weight-bold">{title}</h1>
        {content.length > 0 ? (
          content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p>No content available.</p> // Handle empty content
        )}
        {images.length > 0 && images.map((img, index) => (
          <div key={index} className="mb-3">
            <img className="img-fluid w-50" src={`https://blog-site-1emf.onrender.com/${img}`} alt={`News Image ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between bg-white border border-top-0 p-4">
        <div className="d-flex align-items-center">
          <img className="rounded-circle mr-2" src={`https://blog-site-1emf.onrender.com/${author_avatar}`} width="25" height="25" alt="Author" />
          <span>{author_name}</span>
        </div>
        {/* Add placeholders for views and comments if not provided in the data */}
        <div className="d-flex align-items-center">
          <span className="ml-3"><i className="far fa-eye mr-2"></i>0</span> {/* Placeholder for views */}
          <span className="ml-3"><i className="far fa-comment mr-2"></i>0</span> {/* Placeholder for comments */}
        </div>
      </div>
    </Container>
  );
}

export default SingleNews;
