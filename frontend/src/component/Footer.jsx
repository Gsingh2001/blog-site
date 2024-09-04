import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

function Footer() {
    return (
        <div className="container-fluid bg-dark pt-5 px-sm-3 px-md-5 mt-5">
            <Container>
                <Row className="py-4">
                    <Col lg={3} md={6} className="mb-5">
                        <h5 className="mb-4 text-white text-uppercase font-weight-bold">Get In Touch</h5>
                        <p className="font-weight-medium"><i className="fa fa-map-marker-alt mr-2"></i>123 Street, New York, USA</p>
                        <p className="font-weight-medium"><i className="fa fa-phone-alt mr-2"></i>+012 345 67890</p>
                        <p className="font-weight-medium"><i className="fa fa-envelope mr-2"></i>info@example.com</p>
                        <h6 className="mt-4 mb-3 text-white text-uppercase font-weight-bold">Follow Us</h6>
                        <div className="d-flex justify-content-start">
                            <Button variant="secondary" className="btn-lg btn-lg-square mr-2" href="#"><i className="fab fa-twitter"></i></Button>
                            <Button variant="secondary" className="btn-lg btn-lg-square mr-2" href="#"><i className="fab fa-facebook-f"></i></Button>
                            <Button variant="secondary" className="btn-lg btn-lg-square mr-2" href="#"><i className="fab fa-linkedin-in"></i></Button>
                            <Button variant="secondary" className="btn-lg btn-lg-square mr-2" href="#"><i className="fab fa-instagram"></i></Button>
                            <Button variant="secondary" className="btn-lg btn-lg-square" href="#"><i className="fab fa-youtube"></i></Button>
                        </div>
                    </Col>
                    <Col lg={3} md={6} className="mb-5">
                        <h5 className="mb-4 text-white text-uppercase font-weight-bold">Popular News</h5>
                        <div className="mb-3">
                            <div className="mb-2">
                                <a className="badge badge-primary text-uppercase font-weight-semi-bold p-1 mr-2" href="">Business</a>
                                <a className="text-body" href=""><small>Jan 01, 2045</small></a>
                            </div>
                            <a className="small text-body text-uppercase font-weight-medium" href="">Lorem ipsum dolor sit amet elit. Proin vitae porta diam...</a>
                        </div>
                        <div className="mb-3">
                            <div className="mb-2">
                                <a className="badge badge-primary text-uppercase font-weight-semi-bold p-1 mr-2" href="">Business</a>
                                <a className="text-body" href=""><small>Jan 01, 2045</small></a>
                            </div>
                            <a className="small text-body text-uppercase font-weight-medium" href="">Lorem ipsum dolor sit amet elit. Proin vitae porta diam...</a>
                        </div>
                        <div className="">
                            <div className="mb-2">
                                <a className="badge badge-primary text-uppercase font-weight-semi-bold p-1 mr-2" href="">Business</a>
                                <a className="text-body" href=""><small>Jan 01, 2045</small></a>
                            </div>
                            <a className="small text-body text-uppercase font-weight-medium" href="">Lorem ipsum dolor sit amet elit. Proin vitae porta diam...</a>
                        </div>
                    </Col>
                    <Col lg={3} md={6} className="mb-5">
                        <h5 className="mb-4 text-white text-uppercase font-weight-bold">Categories</h5>
                        <div className="m-n1">
                            <Button variant="secondary" className="btn-sm m-1" href="">Politics</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Corporate</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Health</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Education</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Science</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Foods</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Entertainment</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Travel</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Lifestyle</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Politics</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Corporate</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Health</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Education</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Science</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Business</Button>
                            <Button variant="secondary" className="btn-sm m-1" href="">Foods</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer;
