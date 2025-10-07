import {clerkClient} from '@clerk/express'
export const updateRollEducator=async()=>{
    
    try {
        const userID=req.auth.userID

        await clerkClient.users.updateUserMetadata(userID,{
            publicMetaData:{
                role:'educator',

            }
        })
        res.json({success:true,message:'You can publish a course now'});
    } catch (error) {
        res.json({success:false ,message:error.message})
    }
}