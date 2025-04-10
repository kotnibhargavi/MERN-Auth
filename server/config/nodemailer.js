import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transpoter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "89ab27002@smtp-brevo.com",
        pass: "mWkSVECdwDn2JZ8j",
    },
});



export default transpoter;
