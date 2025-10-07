import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webHooks.js';
import educatorRuter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import bodyParser from "body-parser";
//Initialize Express 
const app=express();

//connect to database

await connectDB()


//middleware
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/',(req,res)=>res.send("API Working"))
app.post(
  "/clerk",
  express.json(),
  clerkWebhooks
);
app.use('/api/educator',express.json(),educatorRuter)

//port

const PORT=process.env.PORT||5000

app.listen(PORT,()=>{
    console.log(`Example app listning on port ${PORT}`)
})
