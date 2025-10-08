import {clerkClient} from '@clerk/express'
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js'



export const updateRollEducator = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ correct way

    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    // Check if user already exists in MongoDB
    let user = await User.findById(userId);

    if (!user) {
      // Create new user in MongoDB
      user = await User.create({
        _id: userId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
      });
      console.log("✅ User saved to MongoDB:", user.email);
    }

    // Update role in Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    console.error("❌ Error saving user:", error.message);
    res.json({ success: false, message: error.message });
  }
};

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