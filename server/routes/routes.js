import {login,logout,register,verifyOtp,sendVerifyOtp,isAuthenticated,sendResetOTP,resetPassword} from "../contollers/contollers.js";
import express from "express";
import { userAuth } from "../middleware/userAuth.js";


const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/send-verify-otp",userAuth, sendVerifyOtp);
authRouter.post("/verify-otp",userAuth, verifyOtp);
authRouter.get("/is-auth",userAuth,isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOTP);
authRouter.post("/reset-password",resetPassword);


export default authRouter;
