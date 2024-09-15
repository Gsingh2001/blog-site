import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database'; // Firebase database imports
import { database } from '../../FirebaseData'; // Import Firebase database from your configuration


function SingleNews() {
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticleData() {
      try {
        // Reference to the specific article in Firebase Realtime Database
        const articleRef = ref(database, `blogPosts/${id}`);
        const snapshot = await get(articleRef);

        if (snapshot.exists()) {
          setArticleData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticleData();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Error: {error}</div>;

  if (!articleData) {
    return <div className="text-center mt-5">No article found.</div>;
  }

  const { title, date, category, content, images, main_image, author_name, author_avatar } = articleData;

  return (
    <Container fluid className="my-5">
      {/* Main Image */}
      <Row className="mb-4">
        <Col>
          <img
            src={main_image} // Ensure `main_image` is the full URL
            alt="Main"
            className="img-fluid rounded"
            style={{ objectFit: 'cover', height: '300px', width: '100%' }}
          />
        </Col>
      </Row>

      {/* Article Content */}
      <Row>
        <Col md={8} lg={12} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <a className="badge badge-primary text-uppercase font-weight-bold p-2" href="#">
                  {category}
                </a>
                <span className="text-muted">
                  {new Date(date).toLocaleDateString()} {/* Format date */}
                </span>
              </div>
              <Card.Title className="text-center text-secondary font-weight-bold mb-4">
                {title}
              </Card.Title>
              {content.length > 0 ? (
                content.map((paragraph, index) => (
                  <Card.Text key={index} className="mb-3">
                    {paragraph}
                  </Card.Text>
                ))
              ) : (
                <Card.Text>No content available.</Card.Text>
              )}
              {images.length > 0 && (
                <Row className="mt-4">
                  {images.map((img, index) => (
                    <Col md={6} lg={4} className="mb-3" key={index}>
                      <img
                        src={img} // Ensure `img` is the full URL
                        alt={`News Image ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img
                  src={author_avatar} // Ensure `author_avatar` is the full URL
                  alt="Author"
                  className="rounded-circle mr-2"
                  style={{ width: '30px', height: '30px' }}
                />
                <span>{author_name}</span>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleNews;
