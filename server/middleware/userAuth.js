import jwt from "jsonwebtoken";




export const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    
    
    if (!token){
        return res.json({success:false, message: "Not Authorized, Login again"});
    }
    try {
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET);
        
        if (tokenDecoded.id){
            req.body = req.body || {}
            req.body.userId = tokenDecoded.id;
            next();
        }
        
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}