import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webHooks.js';
import { clerkMiddleware } from '@clerk/express';
import bodyParser from "body-parser";
import connectCloudinary from './configs/cloudinary.js';
import educatorRouter from './routes/educatorRoutes.js';
import { requireAuth } from "@clerk/express";
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';


//Initialize Express 
const app=express();

//connect to database
await connectDB()
await connectCloudinary()

//middleware
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/',(req,res)=>res.send("API Working"))
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator', requireAuth(), express.json(), educatorRouter);
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter);
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks);
//port

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Example app listning on port ${PORT}`)
})
