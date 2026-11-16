import { generateOtp } from "../src/modules/otp.service.js";

const email = "test@example.com";

const otp = await generateOtp(email);

console.log("Generated OTP:", otp);