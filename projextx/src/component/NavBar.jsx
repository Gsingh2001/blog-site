import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Container, Form, FormControl, Button, Nav, Dropdown } from 'react-bootstrap';
import IMG from "../assets/8041938.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../FirebaseData';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';
import { UserContext } from '../assets/utils/UserContexts';

const categories = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Education', label: 'Education' },
    { value: 'Content', label: 'Content' },
    { value: 'Travel', label: 'Travel' }
];

function NavBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const { user, setUser, setSelectedCategory: setCategoryInContext, setSelectedBlog } = useContext(UserContext);
    const db = getDatabase();

    useEffect(() => {
        if (searchQuery.length > 2) {
            const fetchSuggestions = async () => {
                try {
                    const postsRef = ref(db, 'blogPosts');
                    const queryRef = query(
                        postsRef,
                        orderByChild('title'),
                        startAt(searchQuery),
                        endAt(searchQuery + '\uf8ff')
                    );

                    const snapshot = await get(queryRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const suggestionsArray = Object.values(data);
                        setSuggestions(suggestionsArray);
                    } else {
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, db]);

    const handleSearch = async (event) => {
        event.preventDefault();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleCategorySelect = (category) => {
        navigate('/categories');
        setSelectedCategory(category);
        setCategoryInContext(category);
    };

    const handleSuggestionClick = (item) => {
        setSelectedBlog(item); // Save selected blog item to context
        navigate(`/blogs/`); // Navigate to the selected blog's page
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
                        {searchQuery.length > 2 && (
                            <Dropdown className="position-absolute w-100" style={{ top: '100%', left: 0 }}>
                                <Dropdown.Menu show>
                                    {suggestions.length > 0 ? (
                                        suggestions.map((item) => (
                                            <Dropdown.Item
                                                key={item.id}
                                                onClick={() => handleSuggestionClick(item)}
                                            >
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
                    <Dropdown className="me-3">
                        <Dropdown.Toggle variant="dark" id="dropdown-categories">
                            Categories
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categories.map((category, index) => (
                                <Dropdown.Item
                                    key={index}
                                    onClick={() => handleCategorySelect(category.value)}
                                >
                                    {category.label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
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
                                        src={user.photoURL ? `${user.photoURL}` : './default-profile.png'}
                                        alt="Profile"
                                        width="30"
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
