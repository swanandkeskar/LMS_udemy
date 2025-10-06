import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webHooks.js';

//Initialize Express 
const app=express();

//connect to database

await connectDB()


//middleware
app.use(cors())

//Routes
app.get('/',(req,res)=>res.send("API Working"))
app.post('/clerk',express.json(),clerkWebhooks)

//port

const PORT=process.env.PORT||5000

app.listen(PORT,()=>{
    console.log(`Example app listning on port ${PORT}`)
})
