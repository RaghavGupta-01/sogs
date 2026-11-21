import "dotenv/config";
import { QueueEvents } from "bullmq";
import { generateOtp } from "../src/modules/otp.service.js";
import { emailQueue, EMAIL_QUEUE_NAME } from "../src/infrastructure/queue/email.queue.js";
import { createRedisClient, redis } from "../src/infrastructure/redis/redis.js";

console.log("\n================ [QUEUE & WORKER TEST] ================");
console.log("Note: Make sure 'npm run worker' is running in another terminal.\n");

const queueEvents = new QueueEvents(EMAIL_QUEUE_NAME, {
    connection: createRedisClient(),
});

await queueEvents.waitUntilReady();

queueEvents.on("waiting", ({ jobId }) => {
    console.log(`[Queue Event] Job #${jobId} ENQUEUED (waiting in Redis)`);
});

queueEvents.on("active", ({ jobId }) => {
    console.log(`[Queue Event] Job #${jobId} ACTIVE (worker started processing)`);
});

queueEvents.on("completed", async ({ jobId, returnvalue }) => {
    console.log(`[Queue Event] Job #${jobId} COMPLETED! Result:`, returnvalue);

    setTimeout(async () => {
        const counts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
        console.log("[Queue Status] Job counts in Redis:", counts);
        console.log("========================================================\n");

        await queueEvents.close();
        await emailQueue.close();
        await redis.quit();
        process.exit(0);
    }, 200);
});

queueEvents.on("failed", async ({ jobId, failedReason }) => {
    console.error(`[Queue Event] Job #${jobId} FAILED! Reason: ${failedReason}`);
});

const initialCounts = await emailQueue.getJobCounts("waiting", "active", "completed", "failed");
console.log("[Queue Status] Initial job counts:", initialCounts);

console.log("[Test] Calling generateOtp('user@example.com')...");
const otp = await generateOtp("user@example.com");
console.log(`[Test] OTP generated in Redis: ${otp}`);
console.log("[Test] Waiting for worker to process job...");
