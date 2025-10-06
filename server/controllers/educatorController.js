import clerkClient from '@clerk/express'
export const updateRollEducator=async()=>{
    
    try {
        const userID=req.auth.userID

        await clerkClient.users.updateUserMetadata(userID,)
    } catch (error) {
        
    }
}