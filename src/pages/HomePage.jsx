import React from 'react'
import HomeHeroSection from '../components/Home/HomeHeroSection'
import HomeHeroSecondSection from '../components/Home/HomeHeroSecondSection'
import AppInterfaceSection from '../components/Home/AppInterfaceSection'

export default function HomePage() {
  return (
    <section >
    <HomeHeroSection/>
    <HomeHeroSecondSection/>
    <AppInterfaceSection/>
    </section>
  )
}
