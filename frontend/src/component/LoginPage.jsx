import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../assets/utils/auth';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../assets/utils/UserContexts';
import { Puff } from 'react-loader-spinner'; // Import React Loader
import { toast } from 'react-toastify'; // Import React Toastify

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when request starts
        const data = { username, password };

        try {
            const response = await fetch(`${BaseUrl}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const result = await response.json();
            const token = result.token;
            localStorage.setItem('token', token);
            if (token) {
                const decodedToken = jwtDecode(token);
                localStorage.setItem('user', JSON.stringify(decodedToken));
                setUser(decodedToken);
            }
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            setError('Login failed. Please try again.');
            toast.error('Login failed. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false when request ends
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center h-100">
            <Row className="w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Login</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mt-3" 
                                    disabled={loading} // Disable button while loading
                                >
                                    {loading ? (
                                        <Puff color="#ffffff" height={24} width={24} />
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                                {error && <div className="text-danger mt-3">{error}</div>}
                            </Form>
                            <div className="d-flex justify-content-between mt-3">
                                <Link to="/forgot-password" className="btn btn-link">Forgot Password?</Link>
                                <Link to="/signup" className="btn btn-link">Sign Up</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
