import React from 'react'
import { HeartHandshake,Form ,Earth ,HandHeart  } from 'lucide-react'

const features =[
    {
       title:"Real-time interaction with experts" ,
       icon:HeartHandshake
    },
     {
       title:"Practical advice on fitness, nutrition, skin care, and mental health" ,
       icon:Form
    }
,
 {
       title:"Accessible from anywhere, anytime" ,
       icon:Earth
    },
     {
       title:"Tailored for moms at every stage of motherhood" ,
       icon:HandHeart
    }
]
export default function WebinarFeatures() {

  return (
    <section className=' flex justify-center py-14 bg-white'>
         <div className='max-w-5xl'>
                                        <div className='grid grid-cols-2 md:grid-cols-4 max-w-5xl gap-6'>

            {
                features.map(
                    (f,i) => {return(
                        <div>

                                <div key={i} className=' flex flex-col items-center'>
                                    <f.icon className='text-teal-800 w-8 h-8 '/>
                               <p className='text-center pt-6'>{f.title}</p>
                                    </div>
                                    </div>
                        
                )}
                )
            }
            </div>
    </div>
    </section>
  )
}
