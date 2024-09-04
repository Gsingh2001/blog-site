import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBlogPage from './component/AddBlogPage';
import NavBar from './component/NavBar';
import Footer from './component/Footer';
import SingleNews from './component/SingleNews';

import './index.css';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-blog" element={<AddBlogPage />} />
          <Route path="/blog/:id" element={<SingleNews />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;
