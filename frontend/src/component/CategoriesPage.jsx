import React, { useContext } from 'react';
import { UserContext } from '../assets/utils/UserContexts';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function CategoriesPage() {
    const { selectedCategory, blogData, setSelectedBlog } = useContext(UserContext);
    const navigate = useNavigate();

    // Check if blogData and selectedCategory are available
    if (!blogData || !selectedCategory) {
        navigate('/');
    }

    // Filter blogData by selectedCategory
    const filteredBlogs = Object.values(blogData).filter(blog =>
        blog.category.includes(selectedCategory)
    );

    // Function to handle "Read More" click
    const handleReadMore = (blog) => {
        setSelectedBlog(blog);
        navigate(`/blogs/`); // Assuming `blog.id` is the unique identifier
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">{selectedCategory} Posts</h1>
            <Row>
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog, index) => (
                        <Col md={4} lg={3} key={index} className="mb-3">
                            <Card>
                                <Card.Img variant="top" src={blog.main_image} alt={blog.title} />
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>{blog.content[0]}</Card.Text>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleReadMore(blog)}
                                    >
                                        Read More
                                    </button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No posts available for this category.</p>
                )}
            </Row>
        </Container>
    );
}

export default CategoriesPage;
