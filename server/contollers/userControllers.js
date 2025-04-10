import userModel from "../model/userModel.js";

export const getUser = async (req,res)=>{
    
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        res.json({success:true, userData :{
            name:user.name,
            email:user.email,
            isVerified:user.isVerified
        }});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}