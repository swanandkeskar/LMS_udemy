import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16'>
     <p className='text-base text-gray-500'>Trusted from learners from </p>
     <div className='flex flex-wrap  items-center justify-center gap-6 
     md:gap:16 md:mt-10 mt-5'>
      <img className='w-20 md:w-28' src={assets.microsoft_logo} alt="microsoft" />
      <img className='w-20 md:w-28' src={assets.walmart_logo} alt="walmart" />
      <img className='w-20 md:w-28' src={assets.accenture_logo} alt="swanand" />
      <img className='w-20 md:w-28' src={assets.adobe_logo} alt="microsoft" />
      <img className='w-20 md:w-28' src={assets.paypal_logo} alt="microsoft" />
     </div>
    </div>
  )
}

export default Companies
