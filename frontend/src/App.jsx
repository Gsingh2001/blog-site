import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBlogPage from './component/AddBlogPage';
import NavBar from './component/NavBar';
import Footer from './component/Footer';
import SingleNews from './component/SingleNews';
import './index.css';
import AuthPage from './component/AuthPage';
import LoginPage from './component/LoginPage';
import SignupPage from './component/SignupPage';
import ForgotPasswordPage from './component/ForgotPasswordPage';
import ProfilePage from './component/ProfilePage';
import { UserProvider } from './assets/utils/UserContexts';
import MyBlog from './component/MyBlog';
import EditBlogPage from './component/EditBlogPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SingleBlog from './component/SingleBlog';
import CategoriesPage from './component/CategoriesPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/" element={<AuthPage />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/add-blog" element={<AddBlogPage />} />
            <Route path="/blog/:id" element={<SingleNews />} />
            <Route path="/blogs" element={<SingleBlog />} />
            <Route path="/myblogs" element={<MyBlog />} />
            <Route path="/editblog/:id" element={<EditBlogPage />} />
            <Route path="/categories" element={<CategoriesPage />} />

          </Routes>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
