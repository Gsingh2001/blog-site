import React from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center h-100">
            <Row className="w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Forgot Password</Card.Title>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Submit
                                </Button>
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
