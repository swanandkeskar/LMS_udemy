import { createContext,useState  } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import {useAuth,useUser} from '@clerk/clerk-react'



export const AppContext=createContext();
const currency="₹";

 export const AppContextProvider=(props)=>{
    const navigate=useNavigate();

    const {getToken}=useAuth()
    const {user}=useUser()
    const [allCourses, setAllCourses] = useState([])
    const [isEducator,setIsEducator]=useState(true)
    const [enrolledCourses, setenrolledCourses] = useState([])

     const fetchAllCourses=async()=>{
        setAllCourses(dummyCourses)
     } 
    const calculateRating=(course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalRating=0;
        course.courseRatings.forEach(rating=>{
            totalRating+=rating.rating
        })
        return totalRating/course.courseRatings.length
    }
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
        setenrolledCourses(dummyCourses)
    }


    useEffect(() => {
       fetchAllCourses() 
       fetchUserEnrolledCourses()
     }, [])

     const logToken =async()=>{
        console.log(await getToken());
     } 
     
    useEffect(() => {
      if(user){
        logToken()
      }
    
     
    }, [user])
    
    const value={
        allCourses,navigate,calculateRating,isEducator,setIsEducator,
        calculateNoOfLectures,
        calculateChapterTime,
        calculateCourseDuration,currency,
        enrolledCourses,fetchUserEnrolledCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
 }