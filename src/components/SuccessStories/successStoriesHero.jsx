import React from 'react'
import hero from "../../assets/success stories/success hero.png"
import SuccessStoriesStats from './successStoriesStats'
export default function SuccessStoriesHero() {
  return (
    <section className='sm:min-h-screen w-full' style={{
            background: "linear-gradient(90deg, #E8E7E7 0%, #ebeaea 50%, #ebeaea 100%)",

    }}>
        <div className='flex justify-center'>
            <img src={hero} className='mt-18 sm:w-[80%] w-full'/>
        </div>
        <SuccessStoriesStats/>
    </section>
  )
}
