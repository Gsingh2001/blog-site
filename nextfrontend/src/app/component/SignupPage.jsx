import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { auth, storage, createUserWithEmailAndPassword, updateProfile, ref, uploadBytes, getDownloadURL } from '../../FirebaseData';

const SignupPage = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true); // Show loader

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload profile photo
      let photoURL = '';
      if (profilePhoto) {
        const photoRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(photoRef, profilePhoto);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update user profile
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL
      });

      toast.success('Signup successful!');
      console.log('Signup successful:', user);
      // Redirect or handle successful signup here
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center h-100">
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Sign Up</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formProfilePhoto">
                  <Form.Label>Profile Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </Form.Group>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? <TailSpin height={20} width={20} color="#fff" /> : 'Sign Up'}
                </Button>
                {error && <div className="text-danger mt-3">{error}</div>}
              </Form>
              <div className="d-flex justify-content-between mt-3">
                <Link to="/login" className="btn btn-link">Login</Link>
                <Link to="/forgot-password" className="btn btn-link">Forgot Password?</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
