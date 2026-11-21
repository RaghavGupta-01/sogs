import "dotenv/config";
import { QueueEvents } from "bullmq";
import { generateOtp } from "../src/modules/otp.service.js";
import { emailQueue, EMAIL_QUEUE_NAME } from "../src/infrastructure/queue/email.queue.js";
import { createRedisClient, redis } from "../src/infrastructure/redis/redis.js";

console.log("\n================ [CONCURRENCY TEST] ================");
console.log("Note: Make sure 'npm run worker' is running in another terminal.\n");

const queueEvents = new QueueEvents(EMAIL_QUEUE_NAME, {
    connection: createRedisClient(),
});

await queueEvents.waitUntilReady();

const TOTAL_JOBS = 10;
let completedCount = 0;
let currentActive = 0;
let peakConcurrency = 0;
const startTime = Date.now();

queueEvents.on("active", ({ jobId }) => {
    currentActive++;
    if (currentActive > peakConcurrency) {
        peakConcurrency = currentActive;
    }
    console.log(`[Concurrency] Job #${jobId} ACTIVE -> In-flight: ${currentActive} (Peak: ${peakConcurrency})`);
});

queueEvents.on("completed", async ({ jobId }) => {
    currentActive = Math.max(0, currentActive - 1);
    completedCount++;
    console.log(`[Concurrency] Job #${jobId} COMPLETED -> Progress: ${completedCount}/${TOTAL_JOBS} (In-flight: ${currentActive})`);

    if (completedCount === TOTAL_JOBS) {
        const totalDurationMs = Date.now() - startTime;
        console.log("\n--- Concurrency Test Summary ---");
        console.log(`Total jobs processed : ${completedCount}/${TOTAL_JOBS}`);
        console.log(`Peak concurrent jobs : ${peakConcurrency}`);
        console.log(`Total duration       : ${totalDurationMs}ms`);

        const counts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
        console.log("[Queue Status] Job counts in Redis:", counts);
        console.log("========================================================\n");

        await queueEvents.close();
        await emailQueue.close();
        await redis.quit();
        process.exit(0);
    }
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
    currentActive = Math.max(0, currentActive - 1);
    console.error(`[Concurrency] Job #${jobId} FAILED! Reason: ${failedReason}`);
});

console.log(`[Concurrency] Enqueueing ${TOTAL_JOBS} concurrent OTP requests...`);

const promises = Array.from({ length: TOTAL_JOBS }, (_, i) =>
    generateOtp(`user${i + 1}@example.com`)
);

await Promise.all(promises);
console.log(`[Concurrency] All ${TOTAL_JOBS} jobs dispatched to Redis! Awaiting worker...\n`);
