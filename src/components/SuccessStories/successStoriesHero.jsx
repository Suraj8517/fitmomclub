import React from 'react'
import hero from "../../assets/success stories/success hero.png"
import SuccessStoriesStats from './successStoriesStats'
export default function SuccessStoriesHero() {
  return (
    <section className='min-h-[120vh] w-full bg-[#EAE9E9]'>
        <div className='flex justify-center'>
            <img src={hero} className='mt-18 sm:w-[80%] w-full'/>
        </div>
        <SuccessStoriesStats/>
    </section>
  )
}
