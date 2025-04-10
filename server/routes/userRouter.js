import express from "express";
import { getUser } from "../contollers/userControllers.js";
import { userAuth } from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get("/data",userAuth, getUser);  
export default userRouter;
