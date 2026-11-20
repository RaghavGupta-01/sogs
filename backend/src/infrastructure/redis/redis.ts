import { Redis } from "ioredis";

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error);
});

export const createRedisClient = (): Redis => {
    return new Redis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });
};
