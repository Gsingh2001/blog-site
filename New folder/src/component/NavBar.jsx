import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Container, Form, FormControl, Button, Nav, Dropdown } from 'react-bootstrap';
import IMG from "../assets/8041938.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../assets/utils/auth';
import { UserContext } from '../assets/utils/UserContexts';

function NavBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate(); // Hook to programmatically navigate
    const { user, setUser } = useContext(UserContext); // Use the user context

    useEffect(() => {
        // Fetch suggestions only if there is a search query
        if (searchQuery.length > 2) { // Start fetching after 3 characters
            const fetchSuggestions = async () => {
                try {
                    const query = new URLSearchParams({ all: searchQuery }).toString();
                    const response = await fetch(`${BaseUrl}articles?${query}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setSuggestions(data); // Set the suggestions based on the API response
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]); // Clear suggestions if the query is too short
        }
    }, [searchQuery]);

    const handleSearch = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Optionally handle form submission, or search on change itself
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={IMG}
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Kuldeep Blogs
                </Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">
                    <div className="position-relative me-3">
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button type="submit" variant="outline-light">Search</Button>
                        </Form>
                        {/* Dropdown for suggestions */}
                        {searchQuery.length > 2 && (
                            <Dropdown className="position-absolute w-100" style={{ top: '100%', left: 0 }}>
                                <Dropdown.Menu show>
                                    {suggestions.length > 0 ? (
                                        suggestions.map((item, index) => (
                                            <Dropdown.Item key={index} as={Link} to={`/blog/${item.id}`}>
                                                {item.title}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item disabled>No suggestions found</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </div>
                    {user ? (
                        <>
                            <Link to="/add-blog">
                                <Button variant="outline-light">Add Blog</Button>
                            </Link>
                            <Link to="/myblogs">
                                <Button variant="outline-light">My Blog</Button>
                            </Link>
                            <Dropdown className="btn-group dropleft">
                                <Dropdown.Toggle
                                    variant="dark"
                                    id="dropdown-custom-components"
                                    className="dropdown-toggle"
                                >
                                    <img
                                        src={user.profilePhoto ? `${BaseUrl}${user.profilePhoto}` : './default-profile.png'}
                                        alt="Profile"
                                        width="30" // Adjust as needed
                                        height="30"
                                        className="rounded-circle"
                                    />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="outline-light">Login</Button>
                            </Link>
                        </>


                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
