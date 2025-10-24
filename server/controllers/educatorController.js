import {clerkClient} from '@clerk/express'
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js'
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';


//update role to educator
export const updateRollEducator=async(req,res)=>{
    try {
        const { userId } = req.auth();

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
        const educatorId=req.auth().userId

        if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No valid user ID found",
      });
    }

        if(!imageFile){
            return res.json({success:false,message:"Thumbnail not attached"})
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

//get Educator Courses

export const getEducatorCourses=async(req,res)=>{
    try {
        const educator=req.auth().userId
        const courses=await Course.find({educator})
        res.json({success:true,courses})
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}

//Get Educator DashBoard Data(Total Earning ,Enrolled Students ,No of Courses)

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;

    // 1️⃣ Get all educator courses
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // 2️⃣ Get all completed purchases for these courses
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'Completed'
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle price')
      .sort({ createdAt: -1 });

    // 3️⃣ Calculate total earnings
    const totalEarnings = purchases.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    // 4️⃣ Latest 5 enrollments
    const enrolledStudentsData = purchases.slice(0, 5).map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId?.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    // 5️⃣ Return in the same structure your frontend expects
    res.json({
      success: true,
      dashBoardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.json({ success: false, message: error.message });
  }
};


//Get Enrolled Students Data with purchase Data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'Completed'
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle')
      .sort({ createdAt: -1 });

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId?.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
