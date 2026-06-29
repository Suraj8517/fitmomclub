import React from 'react'
import HomePage from './HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aboutus from './Aboutus';
import Navbar from '../components/NavBar';
import OurAppPage from './OurAppPage';
export default function LandingPage() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/about-us' element={<Aboutus/>}/>
        <Route path='/our-app' element={<OurAppPage/>}/>
      </Routes>
    </Router>
    </>
  )
}
