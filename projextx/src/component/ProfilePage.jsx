import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BaseUrl } from '../assets/utils/auth';

const ProfilePage = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.displayName);
            setEmail(user.email);
            setProfilePhoto(user.photoURL ? `${user.photoURL}` : './default-profile.png');
        }
        console.log(user.email)
        console.log(localStorage.getItem('user'));

    }, []);



    return (
        <Container className="d-flex align-items-center justify-content-center h-100">
            <Row className="w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Profile</Card.Title>
                            <div className="text-center mb-4">
                                <img
                                    src={profilePhoto}
                                    alt="Profile"
                                    width="150"
                                    height="150"
                                    className="rounded-circle"
                                />
                            </div>
                            <div className="mb-3">
                                <strong>Username:</strong> {username}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {email}
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <Link to="/" className="btn btn-link">Back to Home</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
