import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

function Footer() {
    return (
        <div className="container-fluid bg-dark px-sm-3 ">
            <Container>
                <Row className="py-4">
                    <Col lg={4} md={6} className="">
                        <h5 className="mb-4 text-white text-uppercase font-weight-bold">Contact Us</h5>
                        <p className="font-weight-medium"><i className="fa fa-map-marker-alt mr-2"></i>123 Street, New York, USA</p>
                        <p className="font-weight-medium"><i className="fa fa-phone-alt mr-2"></i>+012 345 67890</p>
                        <p className="font-weight-medium"><i className="fa fa-envelope mr-2"></i>info@example.com</p>                        
                    </Col>
                   
                    <Col lg={4} md={12} className="">
                        <h5 className="mb-4 text-white text-uppercase font-weight-bold">Categories</h5>
                        <div className="d-flex flex-wrap">
                            <Button variant="secondary" className="btn-sm m-1" href="">Politics</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Health</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Education</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Science</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Foods</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Entertainment</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Travel</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Lifestyle</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer;
