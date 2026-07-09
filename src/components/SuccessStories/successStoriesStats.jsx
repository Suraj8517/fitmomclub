import React from 'react'
import { Users, Star, Globe2, CircleCheck,Heart } from "lucide-react";


const stats = [
  { Icon: Users, value: "1,00,000+", label: "Real Transformation" },
  { Icon: Star, value: "4.7", label: "Average rating" },
  { Icon: Globe2, value: "70+", label: "Countries reached" },
  { Icon: CircleCheck, value: "98%", label: "Success Rate" },
];
export default function SuccessStoriesStats() {
  return (
    <div className='w-full mx-auto'>
<div className="max-w-4xl grid grid-cols-2 sm:grid-cols-4 sm:divide-x divide-[#c4c0c6] px-6 sm:py-2 mx-auto">            {
                stats.map((stat,i)=>{return(
                    <div key={i} className="flex flex-row justify-center gap-4 py-4 sm:py-1">
                        <div className='flex items-center'>
                        <stat.Icon
                  className="text-[#0E7C74]  rounded-full border border-[#0E7C74] p-2 "
                  size={45}
                  strokeWidth={1.15}
                />
                </div>
                <div className='flex flex-col'>
                    <h2 className='sm:text-xl text-teal-700 font-semibold font-[poppins] text-lg'>
                        {stat.value}
                    </h2>
                    <p className='text-xs max-w-sm'>
                        {stat.label}
                    </p>
                    </div>
                        </div>
                        
                )})
            }
    </div>
    <div className='flex justify-center mt-2 sm:gap-2 flex-col sm:flex-row items-center'>
        <h3 className='hidden sm:block text-sm font-[poppins] font-medium tracking-widest'>STRONGER MOMS. <span className='text-teal-500'>HAPPIER FAMILIES.</span> HEALTHIER FUTURES.</h3>
                <h3 className='text-center sm:hidden block text-sm font-[poppins] font-medium tracking-widest'>STRONGER MOMS.<br/> <span className='text-teal-500'>HAPPIER FAMILIES.</span><br/> HEALTHIER FUTURES.</h3>

        <Heart className='w-4 -translate-y-0.5 text-[#0E7C74]' style={{fill:"#35c6a9",}}/>
    </div>
    </div>
    
  )
}
