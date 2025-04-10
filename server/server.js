import express from "express";
import cors from "cors";
import connectDB from "./config/config.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/routes.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();            
const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));
  
app.use(express.json());
const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//API END POINTS
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

