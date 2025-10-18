import express from 'express'
import { getAllCourses, getCoursebyId } from '../controllers/courseController.js';

const courseRouter=express.Router();

courseRouter.get('/all',getAllCourses);
courseRouter.get('/:id',getCoursebyId);

export default courseRouter;



