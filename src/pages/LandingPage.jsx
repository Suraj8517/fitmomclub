import React from 'react'
import HomePage from './HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aboutus from './Aboutus';

export default function LandingPage() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='about-us' element={<Aboutus/>}/>
      </Routes>
    </Router>
    </>
  )
}
