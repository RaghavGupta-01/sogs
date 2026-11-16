import { randomInt } from "node:crypto";
import { redis } from "../infrastructure/redis/redis.js";

export const generateOtp = async (email: string) => {

    const otp = randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");

    const normalizedEmail = email.trim().toLowerCase();

    const key = `otp:${normalizedEmail}`;

    await redis.set(key, otp);

    return otp;

};
