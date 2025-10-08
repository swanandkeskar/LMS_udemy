import express from 'express'
import { addCourse, updateRollEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter=express.Router()

//add educator role

educatorRouter.get('/update-role',updateRollEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse);

export default educatorRouter;