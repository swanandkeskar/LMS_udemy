import React, { useContext, useEffect, } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import {AppContext} from '../../context/AppContext'
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const {openSignIn}=useClerk()
  const {user}=useUser()
  const location=useLocation();
  const {navigate,isEducator}=useContext(AppContext);
  const isCourseListPage=location.pathname.includes('/course-list');
  

  
  return (
    
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b
       border-gray-500 py-4 ${isCourseListPage?'bg-white':'bg-cyan-100/70'} `}>
        <Link to='/'>
       
      <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer'/>
        </Link>
        
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
         {user && <>
          <button className='cursor-pointer' onClick={()=>{navigate('/educator')}}>{isEducator?"Educator Dashboard":
          "Become Educator"}</button>
          <span>|</span>
          <Link to='/my-enrollments'>My Enrollements</Link></>}
        </div>
        {user?<UserButton/>:(<button onClick={()=>openSignIn()} 
        className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>)}
      </div>
      
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div >
           {user && <><button onClick={()=>{navigate('/educator')}}>{isEducator?"Educator Dashboard":"Become Educator"}</button>
          <span>|</span>
          <Link to='/my-enrollments'>My Enrollements</Link></>}
          {user?(<button >signed in</button>):( <button ><img src={assets.user_icon} alt="" /></button>)}

        </div>
       
      </div>
    </div>
  )
}

export default Navbar
