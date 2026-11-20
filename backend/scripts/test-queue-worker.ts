import "dotenv/config";
import { QueueEvents } from "bullmq";
import { generateOtp } from "../src/modules/otp.service.js";
import { emailWorker, closeEmailWorker } from "../src/infrastructure/queue/email.worker.js";
import { emailQueue, EMAIL_QUEUE_NAME } from "../src/infrastructure/queue/email.queue.js";
import { createRedisClient, redis } from "../src/infrastructure/redis/redis.js";

console.log("\n================ [QUEUE & WORKER TEST] ================");

// 1. Listen to queue events for visibility during testing
const queueEvents = new QueueEvents(EMAIL_QUEUE_NAME, {
    connection: createRedisClient(),
});

queueEvents.on("waiting", ({ jobId }) => {
    console.log(`[Queue Event] Job #${jobId} ENQUEUED (in waiting state)`);
});

queueEvents.on("active", ({ jobId }) => {
    console.log(`[Queue Event] Job #${jobId} ACTIVE (picked up by worker)`);
});

queueEvents.on("completed", async ({ jobId, returnvalue }) => {
    console.log(`[Queue Event] Job #${jobId} COMPLETED! Result:`, returnvalue);

    // Give a brief moment for worker logs to settle, then inspect queue counts
    setTimeout(async () => {
        const counts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
        console.log("[Queue Status] Current job counts in Redis:", counts);
        console.log("========================================================\n");

        await queueEvents.close();
        await closeEmailWorker();
        await emailQueue.close();
        await redis.quit();
        process.exit(0);
    }, 200);
});

queueEvents.on("failed", async ({ jobId, failedReason }) => {
    console.error(`[Queue Event] Job #${jobId} FAILED! Reason: ${failedReason}`);
});

// 2. Wait until worker and event listener are ready
await emailWorker.waitUntilReady();
await queueEvents.waitUntilReady();

// 3. Print initial queue counts
const initialCounts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
console.log("[Queue Status] Initial job counts:", initialCounts);

// 4. Trigger OTP generation (which enqueues the email job)
console.log("[Test] Calling generateOtp('user@example.com')...");
const otp = await generateOtp("user@example.com");
console.log(`[Test] OTP generated in Redis: ${otp}`);
