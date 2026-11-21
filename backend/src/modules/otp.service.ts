import "dotenv/config";
import { randomInt, createHmac } from "node:crypto";
import { redis } from "../infrastructure/redis/redis.js";
import { addEmailJob } from "../infrastructure/queue/email.queue.js";

const OTP_TTL_SECONDS = 300;

const hashOtp = (otp: string, email: string): string => {
    const secret = process.env.OTP_SECRET;

    if (!secret) {
        throw new Error("OTP_SECRET is not configured");
    }

    return createHmac("sha256", secret)
        .update(`${email}:${otp}`)
        .digest("hex");
};

export const generateOtp = async (email: string): Promise<string> => {
    const normalizedEmail = email.trim().toLowerCase();

    const otp = randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");
    console.log("otp: ", otp);

    const hashedOtp = hashOtp(otp, normalizedEmail);

    const key = `otp:${normalizedEmail}`;

    await redis.set(key, hashedOtp, "EX", OTP_TTL_SECONDS);

    await addEmailJob({
        to: normalizedEmail,
        subject: "Your SOGS Verification Code",
        text: `Your one-time verification code is: ${otp}. It will expire in 5 minutes.`,
    });

    return otp;
};


export const verifyOtp = async (email: string, otp: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const key = `otp:${normalizedEmail}`;

    const storedHashedOtp = await redis.get(key);

    if (!storedHashedOtp) {
        return false;
    }

    const providedHashedOtp = hashOtp(otp, normalizedEmail);

    return storedHashedOtp === providedHashedOtp;
}