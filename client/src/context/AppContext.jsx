import { createContext,useState,useEffect  } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";



export const AppContext=createContext();
const currency="$";

 export const AppContextProvider=(props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const navigate=useNavigate();

    const {getToken}=useAuth()
   
    const {user}=useUser()
    const [allCourses, setAllCourses] = useState([])
    const [isEducator,setIsEducator]=useState(false)
    const [enrolledCourses, setenrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

//fetch all courses 
     const fetchAllCourses=async()=>{
       try {
        const {data}=await axios.get(backendUrl+'/api/course/all');
        if(data.success){
            setAllCourses(data.courses)
        }else{
            toast.error(data.message)
        }

       } catch (error) {
        toast.error(error.message)
       }
     } 
// Fetch user data
const fetchUserData=async(req,res)=>{
    if(user.publicMetadata.role==='educator'){
        setIsEducator(true)
    }
    try {
        const token =await getToken();
        const {data}=await axios.get(backendUrl+'/api/user/data',{headers:{
            Authorization:`Bearer ${token}`
        }})
        if(data.success){
            setUserData(data.user)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
}


//function to calculate average rating of course 
  const calculateRating = (course) => {
  const ratings = course?.courseRatings || []; // fallback to empty array

  if (ratings.length === 0) {
    return 0;
  }

  let totalRating = 0;
  ratings.forEach(r => {
    totalRating += r.rating || 0; // in case rating object has missing value
  });

  return Math.floor(totalRating / ratings.length);
};

    //function to calculate course chapter time
    const calculateChapterTime=(chapter)=>{
        let time=0;
        chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000,{units:["h","m"]})
    }
    //function to calculate course chapter time
    const calculateCourseDuration=(course)=>{
        let time=0;

        course.courseContent.map((chapter)=>chapter.chapterContent.map(
            (lecture)=>time+=lecture.lectureDuration
        ))
         return humanizeDuration(time * 60 * 1000,{units:["h","m"]})

    }
    //function to claculte no of lectures in the course 
    const calculateNoOfLectures=(course)=>{
        let totalLectures=0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length
            }
        });
        return totalLectures;

    }
    //fetch user enrolled courses
    const fetchUserEnrolledCourses=async()=>{
        try {
             const token =await getToken()
        const {data} =await axios.get(backendUrl+'/api/user/enrolled-courses',
            {headers:{Authorization:`Bearer ${token}`}}
        )
        if(data.success){
            if(Array.isArray(data.enrolledCourses)){
                setenrolledCourses(data.enrolledCourses.reverse())
            }else{
                setenrolledCourses([])
            }
            
        }else{
            toast.error(data.message)
        }
        } catch (error) {
           toast.error(error.message) 
        }

    }

    useEffect(() => {
       fetchAllCourses() 
       
     }, [])


     
    useEffect(() => {
      if(user){
        
        
        fetchUserData()
        fetchUserEnrolledCourses()
      }
    
     
    }, [user])
    
    const value={
        allCourses,navigate,calculateRating,isEducator,setIsEducator,
        calculateNoOfLectures,
        calculateChapterTime,
        calculateCourseDuration,currency,
        enrolledCourses,fetchUserEnrolledCourses,
        backendUrl,userData,setUserData,getToken,fetchAllCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
 }