import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AuthImage from "/authimage.jpg";

const AuthPage = () => {
    return (
            <Row noGutters className="h-100">
                <Col md={6}>
                    <img src={AuthImage} alt="Welcome"  className="auth-page__photo" />
                </Col>
                <Col md={6} >
                    <Outlet />
                </Col>
            </Row>
    );
};

export default AuthPage;
