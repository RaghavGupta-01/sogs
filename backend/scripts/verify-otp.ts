import { verifyOtp } from "../src/modules/otp.service.js"; import { createInterface } from "readline/promises";

const email = "test@example.com";
const rl = createInterface({ input: process.stdin, output: process.stdout })
const otp = await rl.question("Enter OTP: ");

const isValid = await verifyOtp(email, otp);

console.log("Is the OTP valid:", isValid);
