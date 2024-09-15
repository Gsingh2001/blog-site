import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import React Toastify
import axios from 'axios'; // Import Axios for API calls
import { BaseUrl } from '../assets/utils/auth'; // Import your base URL

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email address is required');
            return;
        }

        setLoading(true); // Show loader

        try {
            const response = await axios.post(`${BaseUrl}forgot-password`, { username: email });
            toast.success(response.data.message); // Show success toast
            setEmail(''); // Clear email field
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'An error occurred';
            toast.error(errorMsg); // Show error toast
            setError(errorMsg); // Set error state
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center h-100">
            <Row className="w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Forgot Password</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                                {error && <div className="text-danger mt-3">{error}</div>}
                            </Form>
                            <div className="d-flex justify-content-between mt-3">
                                <Link to="/login" className="btn btn-link">Login</Link>
                                <Link to="/signup" className="btn btn-link">Sign Up</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPasswordPage;
