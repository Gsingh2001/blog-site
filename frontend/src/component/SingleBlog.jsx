import React, { useContext, useEffect } from 'react';
import { UserContext } from '../assets/utils/UserContexts';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SingleBlog() {
    // Access the UserContext
    const { selectedBlog } = useContext(UserContext);
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        if (!selectedBlog) {
            navigate('/'); // Navigate to home page if selectedBlog is not available
        }
    }, [selectedBlog, navigate]);

  
    // Destructure properties from selectedBlog
    const {
        main_image,
        category,
        date,
        title,
        content,
        images,
        author_avatar,
        author_name
    } = selectedBlog;

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
                                <span className="badge badge-primary text-uppercase font-weight-bold p-2">
                                    {category}
                                </span>
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
                                                alt={`Additional Image ${index + 1}`}
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

export default SingleBlog;
