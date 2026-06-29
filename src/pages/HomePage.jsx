import React from 'react'
import HomeHeroSection from '../components/Home/HomeHeroSection'
import HomeHeroSecondSection from '../components/Home/HomeHeroSecondSection'
import AppInterfaceSection from '../components/Home/AppInterfaceSection'
import ProgramSection from '../components/Home/ProgramSection'
import StorySection from '../components/Home/StorySection'
import AppShowCaseSection from '../components/Home/AppShowCaseSection'
import OurExpertSection from '../components/Home/OurExpertsSection'
import CTASection from '../components/Home/CTASection'
import CommunityStatsSection from '../components/Home/StatSection'

export default function HomePage() {
  return (
    <section >
    <HomeHeroSection/>
    <HomeHeroSecondSection/>
    <AppInterfaceSection/>
    <ProgramSection/>
    <AppShowCaseSection/>
    <StorySection/>
    <CommunityStatsSection/>
    <OurExpertSection/>
    <CTASection/>
    </section>
  )
}
