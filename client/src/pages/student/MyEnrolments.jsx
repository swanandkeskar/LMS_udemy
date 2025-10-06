import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/students/Footer'

const MyEnrolments = () => {
  const {enrolledCourses,calculateCourseDuration,navigate}=useContext(AppContext);
  const[progresArray,setProgressArray]=useState([
    {lectureCompleted:2,totalLectures:4},
    {lectureCompleted:3,totalLectures:5},
    {lectureCompleted:4,totalLectures:8},
    {lectureCompleted:2,totalLectures:6},
    {lectureCompleted:5,totalLectures:5},
    {lectureCompleted:3,totalLectures:7},
    {lectureCompleted:0,totalLectures:8},
    {lectureCompleted:1,totalLectures:4},
    {lectureCompleted:2,totalLectures:5}
  ])
  return (
    <>
    <div className='px-8 pt-10 md:px-36'>
      <h1 className='text-2xl font-semibold'>My enrollements</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm
          text-left max-sm:hidden' >
          <tr >
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {enrolledCourses.map((course,index)=>(
            <tr key={index} className='border-b border-gray-500/20'>
              <td className='md:px-4 pl-2 md:pl-4  space-x-3 flex items-center'>
                <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28' />
                <div className='flex-1'>
                  <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                  <Line strokeWidth={2} percent={progresArray[index]?
                  (progresArray[index].lectureCompleted*100)/progresArray[index].totalLectures:0} className='bg-gray-300 rounded-full'/>

                </div>
              </td>
              <td className='px-4 py-3 ,max-sm:hidden'>
            {calculateCourseDuration(course)}
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
              {progresArray[index] && `${progresArray[index].lectureCompleted} /
              ${progresArray[index].totalLectures}`}
               <span> Lectures</span> 
              </td>
              <td className='px-4 py-3 max-sm:text-right'>
                <button
  className={`px-3 sm:px-5 py-1.5 sm:py-2 text-white max-sm:text-xs rounded cursor-pointer ${
    progresArray[index] &&
    progresArray[index].lectureCompleted / progresArray[index].totalLectures === 1
      ? "bg-green-800 hover:bg-green-600"
      : "bg-blue-800 hover:bg-blue-600"
  }`} onClick={()=>navigate('/player/'+course._id)}
>
  {progresArray[index] &&
  progresArray[index].lectureCompleted / progresArray[index].totalLectures === 1
    ? "Completed"
    : "On Going"}
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrolments
