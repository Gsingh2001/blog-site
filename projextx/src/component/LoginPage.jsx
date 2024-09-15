import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../assets/utils/UserContexts';
import { Puff } from 'react-loader-spinner'; // Import React Loader
import { toast } from 'react-toastify'; // Import React Toastify
import { auth } from '../../FirebaseData'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth method

const LoginPage = () => {
    const [email, setEmail] = useState(''); // Change from username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when request starts

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken(); // Get the ID token for authenticated user
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            toast.error('Login failed. Please check your credentials and try again.');
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
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
