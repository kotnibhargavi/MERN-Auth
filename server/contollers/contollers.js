import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import transpoter from "../config/nodemailer.js";
import dotenv from "dotenv";
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} from "../config/EmailTemplates.js";


dotenv.config();

//register
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return res.json({success:false, message:"Missing Credentials"})
    }
    try {
        const userExisting = await userModel.findOne({email});
        if (userExisting){
            return res.json({success:false, message:"User already exists"});
        }
        const hassedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({name,email,password:hassedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.Node_Env === "production",
            sameSite:process.env.Node_Env === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000,
        });
        // sending welcome email
        console.log("Sending email to:", email);

        const mailOptions ={
            from:"stoicsxyz@gmail.com",
            to:email,
            subject:"Welcome to our app",
            text:`Hello ${name}, welcome to our app Your account has been created with email ${email}`
        };
        await transpoter.sendMail(mailOptions);

        return res.json({success:true, message:"User created successfully"});


    } catch (error) {
         return res.json({success:false, message:error.message});
    }
}
//login
export const login = async (req, res) => {
    const {email,password} = req.body;
    if (!email || !password){
        return res.json({success:false, message:"Missing Credentials"});
    }

    try {
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({success:false, message:"Invalid Email"});
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid){
            return res.json({success:false, message:"Invalid password"});
        }
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.Node_Env === "production",
            sameSite:process.env.Node_Env === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000,
        });
         
        return res.json({success:true, message:"Login successful"});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}
//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.Node_Env === "production",
            samesite: process.env.Node_Env === "production" ? "none": "strict",
            
        });
        return res.json({success:true, message:"Logout successful"});
    }
    catch (error) {
return res.json({success:false, message:error.message});
    }
}
//send verify otp to registered email-id
export const sendVerifyOtp = async (req, res) => {
    const {userId} = req.body;
    const user = await userModel.findById(userId);
    try {
        if (user.isVerified){
            return res.json({success:false, message:"User already verified"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 24 * 60 *1000;
        await user.save();

        const mailOptions = {
            from:"stoicsxyz@gmail.com",
            to:user.email,
            subject:"Account Verification OTP",
            // text:`Your OTP for account verification is ${otp} Please verify your account within 24 hours`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
            
        }
        await transpoter.sendMail(mailOptions);

        return res.json({success:true, message:"OTP sent to your registered email-id"});
        
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
    
}
//verify Email through otp
export const verifyOtp = async (req, res) => {
    const {userId, otp} = req.body;
    
    const user = await userModel.findById(userId);
    console.log("OTP from user:", otp);
    console.log("OTP in DB:", user.verifyOtp);
    
    if (!user){
        return res.json({success:false, message:"User not found"});
    }
    try {
        if (user.verifyOtp === "" || user.verifyOtp !== otp ){
            return res.json({success:false, message:"Invalid OTP"});
        }
        if (user.verifyOtpExpiry < Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }
        

        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiry = 0;
        await user.save();
        return res.json({success:true, message:"Account verified successfully"});
       

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}
//is user authenticated
export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success:true, message:"User is authenticated"});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

//send password reset otp
export const sendResetOTP = async (req,res)=>{
    const {email} = req.body;
    if (!email){
        return res.json({success:false, message:"Email is required"});
    }
    
    try {
        const user = await userModel.findOne({email});
    if (!user){
        return res.json({success:false, message:"User not found"});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 15 * 60 *1000;
        await user.save();

        const mailOptions = {
            from:"stoicsxyz@gmail.com",
            to:user.email,
            subject:"Password Reset OTP",
            // text:`Your OTP for resetting your password is ${otp}. Use this OTP to resetting your password. Please reset your password within 15 minutes`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
            
        }
        await transpoter.sendMail(mailOptions);

        return res.json({success:true, message:"OTP sent to your registered email-id"});

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

//reset password 
export const resetPassword = async (req,res)=>{
    const {email, otp, newPassword} = req.body;
    
    if(!email || !otp || !newPassword){
        return res.json({success:false, message:"Email, OTP, and new password are required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        if(user.resetOtp !== otp || user.resetOtp === ""){
            return res.json({success:false, message:"Invalid OTP"});
        }
        if(user.resetOtpExpiry < Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }
        const hassedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hassedPassword;
        user.resetOtp = "";
        user.resetOtpExpiry = 0;
        await user.save();
        return res.json({success:true, message:"Password reset successfully"});

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

