import mongoose from "mongoose";

const courseProgressSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    courseId:{type: mongoose.Schema.Types.ObjectId,required:true},
    completed:{type:Boolean,default:false},
    lectureCompleted:[]
},{minimize:false})


 export const courseProgress=mongoose.model('CourseProgress',courseProgressSchema)