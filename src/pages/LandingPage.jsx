import React from 'react'
import HomePage from './HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aboutus from './Aboutus';
import Navbar from '../components/NavBar';
import OurAppPage from './OurAppPage';
import OurCommunity from './OurCommunity'
import SuccessStories from './successStories';
import WebinarPage from './WebinarPage';
import FAQPage from './FAQPage';
import BMICalculator from './Calculators/BMI';
import WaterIntakeCalculator from './Calculators/WaterIntake';
import ProteinIntakeCalculator from './Calculators/ProteinCalculator';
import BodyFatCalculator from './Calculators/BodyFatCalculator';
import OvulationCalculator from './Calculators/OvulationCalculator';
import PregnancyCalculator from './Calculators/PregnancyCalculator';
import MenstrualCycleCalculator from './Calculators/MenstrualCalculator';
import BMRCalculator from './Calculators/BMR';
import HeartRateCalculator from './Calculators/HeartRateCalculator';
import CalorieCalculator from './Calculators/CalorieCalculator';
import WeightGoalCalculator from './Calculators/WeightLossCalculator';
import HealthCalculators from './HealthCalculators';
export default function LandingPage() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/about-us' element={<Aboutus/>}/>
        <Route path='/our-app' element={<OurAppPage/>}/>
        <Route path='/community' element={<OurCommunity/>}/>
        <Route path='/success-stories' element={<SuccessStories/>}/>
        <Route path='/webinars' element={<WebinarPage/>}/>
        <Route path='/FAQs' element={<FAQPage/>}/>
        <Route path='/bmi-calculator' element={<BMICalculator/>}/>
        <Route path='/water-intake-calculator' element={<WaterIntakeCalculator/>}/>
        <Route path='/protein-intake-calculator' element={<ProteinIntakeCalculator/>}/>
        <Route path='/body-fat-calculator' element={<BodyFatCalculator/>}/>
        <Route path='/ovulation-calculator' element={<OvulationCalculator/>}/>
        <Route path='/pregnancy-calculator' element={<PregnancyCalculator/>}/>
        <Route path='/menstrual-cycle-calculator' element={<MenstrualCycleCalculator/>}/>
        <Route path='/bmr-calculator' element={<BMRCalculator/>}/>
        <Route path='/heart-rate-calculator' element={<HeartRateCalculator/>}/>
        <Route path='/calorie-calculator' element={<CalorieCalculator/>}/>
        <Route path='/weight-loss-calculator' element={<WeightGoalCalculator/>}/>
        <Route path='/health-calculator' element={<HealthCalculators/>}/>

      </Routes>
    </Router>
    </>
  )
}
