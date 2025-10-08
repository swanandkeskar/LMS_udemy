import {clerkClient} from '@clerk/express'
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js'



export const updateRollEducator=async(req,res)=>{
    try {
        const { userId } = req.auth;

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',

            }
        }) 
        res.json({success:true,message:'You can publish a course now'});
    } catch (error) {
        res.json({success:false ,message:error.message})
    }
}

//add new Course 
export const addCourse=async(req,res)=>{
    try {
        const {courseData}=req.body
        const imageFile=req.file
        const educatorId=req.auth.userId

        if(!imageFile){
            return res.json({success:true,message:"Thumbnail not attached"})
        }

        const parsedCourseData= await JSON.parse(courseData);
        parsedCourseData.educator=educatorId
        const newCourse=await Course.create(parsedCourseData)
        const imageUpload=await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail=imageUpload.secure_url
        await newCourse.save()

        res.json({success:true,message:"Course Added "})
        
    } catch (error) {
        res.json({success:false,message:error.message})   
    }
}