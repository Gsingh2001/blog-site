import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

function NavBar() {
    return (
        <div className="container-fluid p-0">
            <Navbar className="bg-dark navbar-dark py-2 py-lg-0 px-lg-5" expand="lg">
                <Container>
                    <Navbar.Brand href="index.html" className="d-block d-lg-none">
                        <h1 className="m-0 display-4 text-uppercase text-primary">Biz<span className="text-white font-weight-normal">News</span></h1>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarCollapse" />
                    <Navbar.Collapse id="navbarCollapse" className="justify-content-between px-0 px-lg-3">
                        <Nav className="mr-auto py-0">
                            <Nav.Link href="index.html" className="active">Home</Nav.Link>
                            <Nav.Link href="category.html">Category</Nav.Link>
                            <Nav.Link href="single.html">Single News</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#">Menu item 1</NavDropdown.Item>
                                <NavDropdown.Item href="#">Menu item 2</NavDropdown.Item>
                                <NavDropdown.Item href="#">Menu item 3</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="contact.html">Contact</Nav.Link>
                        </Nav>
                        <Form inline className="ml-auto d-none d-lg-flex" style={{ width: '100%', maxWidth: '300px' }}>
                            <FormControl type="text" placeholder="Keyword" className="border-0" />
                            <Button variant="primary" className="text-dark border-0 px-3">
                                <i className="fa fa-search"></i>
                            </Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavBar;
