import { verifyOtp } from "../src/modules/otp.service.js";
import { createInterface } from "readline/promises";

const email = "test@example.com";
const rl = createInterface({ input: process.stdin, output: process.stdout });
const otp = await rl.question("Enter OTP: ");
rl.close();

const result = await verifyOtp(email, otp);

console.log("Verification result:", result);
process.exit(0);
