import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: "./backend/.env" });
import { generateOtp, verifyOtp } from "../src/modules/otp.service.js";
import { redis } from "../src/infrastructure/redis/redis.js";

console.log("\n================ [OTP SECURITY & ONE-TIME USE TEST] ================");

const testEmail = "security-test@example.com";

console.log("\n--- TEST 1: Invalidation After 3 Failed Attempts ---");
const otp1 = await generateOtp(testEmail);
console.log(`Generated OTP: ${otp1}`);

const attempt1 = await verifyOtp(testEmail, "000000");
console.log("Attempt 1 (Wrong OTP) ->", attempt1);

const attempt2 = await verifyOtp(testEmail, "111111");
console.log("Attempt 2 (Wrong OTP) ->", attempt2);

const attempt3 = await verifyOtp(testEmail, "222222");
console.log("Attempt 3 (Wrong OTP) ->", attempt3);

const attempt4 = await verifyOtp(testEmail, otp1);
console.log("Attempt 4 (Correct OTP after invalidation) ->", attempt4);

if (!attempt4.success) {
    console.log("✓ SUCCESS: OTP was successfully invalidated after 3 failed attempts!");
} else {
    console.error("✗ FAILURE: Correct OTP was accepted after reaching max attempts!");
}

console.log("\n--- TEST 2: One-Time Use (Key Deletion on Success) ---");
const otp2 = await generateOtp(testEmail);
console.log(`Generated Fresh OTP: ${otp2}`);

const successAttempt = await verifyOtp(testEmail, otp2);
console.log("First verification (Correct OTP) ->", successAttempt);

const replayAttempt = await verifyOtp(testEmail, otp2);
console.log("Replay verification (Same OTP again) ->", replayAttempt);

if (successAttempt.success && !replayAttempt.success) {
    console.log("✓ SUCCESS: Key was deleted on success! OTP cannot be reused.");
} else {
    console.error("✗ FAILURE: OTP was reused after successful verification!");
}

console.log("====================================================================\n");
await redis.quit();
process.exit(0);
