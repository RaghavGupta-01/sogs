import "dotenv/config";
import { QueueEvents } from "bullmq";
import { generateOtp } from "../src/modules/otp.service.js";
import { emailQueue, EMAIL_QUEUE_NAME } from "../src/infrastructure/queue/email.queue.js";
import { createRedisClient, redis } from "../src/infrastructure/redis/redis.js";

console.log("\n================ [RETRY & FAILURE TEST] ================");
console.log("Note: Make sure 'npm run worker' is running in another terminal.\n");

const queueEvents = new QueueEvents(EMAIL_QUEUE_NAME, {
    connection: createRedisClient(),
});

await queueEvents.waitUntilReady();

queueEvents.on("failed", async ({ jobId, failedReason }) => {
    const job = await emailQueue.getJob(jobId);
    if (!job) return;

    const attemptsMade = job.attemptsMade;
    const maxAttempts = job.opts.attempts ?? 3;

    console.log(`[Retry Test] Job #${jobId} FAILED attempt ${attemptsMade}/${maxAttempts}. Reason: ${failedReason}`);

    if (attemptsMade < maxAttempts) {
        console.log(`[Retry Test] -> BullMQ scheduled exponential backoff for attempt ${attemptsMade + 1}...`);
    } else {
        console.log(`[Retry Test] -> All ${maxAttempts} attempts exhausted! Job moved to permanent FAILED state.`);

        const counts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
        console.log("\n[Retry Test] Final Queue counts in Redis:", counts);
        console.log("========================================================\n");

        await queueEvents.close();
        await emailQueue.close();
        await redis.quit();
        process.exit(0);
    }
});

console.log("[Retry Test] Calling generateOtp('fail-user@example.com') to simulate provider failure...");
const otp = await generateOtp("fail-user@example.com");
console.log(`[Retry Test] OTP generated: ${otp}`);
console.log("[Retry Test] Awaiting worker to process attempts and exponential backoff...\n");
