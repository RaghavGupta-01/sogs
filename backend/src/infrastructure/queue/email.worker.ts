import { Worker, type Job } from "bullmq";
import { bullmqRedisOptions } from "../redis/redis.js";
import { EmailFactory, type SendEmailResult, type SendEmailOptions } from "../email/index.js";
import { EMAIL_QUEUE_NAME, type EmailJobData } from "./email.queue.js";

const DEFAULT_CONCURRENCY = 5;

export const emailWorker = new Worker<EmailJobData, SendEmailResult>(
    EMAIL_QUEUE_NAME,
    async (job: Job<EmailJobData, SendEmailResult>) => {
        console.log(`[EmailWorker] Processing job #${job.id} (attempt ${job.attemptsMade + 1}/${job.opts.attempts}) for ${job.data.to}`);

        const emailOptions: SendEmailOptions = {
            to: job.data.to,
            subject: job.data.subject,
        };

        if (job.data.text !== undefined) {
            emailOptions.text = job.data.text;
        }
        if (job.data.html !== undefined) {
            emailOptions.html = job.data.html;
        }
        if (job.data.from !== undefined) {
            emailOptions.from = job.data.from;
        }

        const emailService = EmailFactory.getInstance();
        const result = await emailService.sendEmail(emailOptions);

        return result;
    },
    {
        connection: bullmqRedisOptions,
        concurrency: process.env.EMAIL_WORKER_CONCURRENCY
            ? Number(process.env.EMAIL_WORKER_CONCURRENCY)
            : DEFAULT_CONCURRENCY,
    }
);

emailWorker.on("completed", (job: Job<EmailJobData, SendEmailResult>, result: SendEmailResult) => {
    console.log(`[EmailWorker] Job #${job.id} completed successfully. Message-ID: ${result.messageId}`);
});

emailWorker.on("failed", (job: Job<EmailJobData, SendEmailResult> | undefined, error: Error) => {
    if (job) {
        console.error(
            `[EmailWorker] Job #${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}). Reason: ${error.message}`
        );
    } else {
        console.error(`[EmailWorker] Job failed with error: ${error.message}`);
    }
});

emailWorker.on("error", (error: Error) => {
    console.error("[EmailWorker] Worker error:", error);
});

export const closeEmailWorker = async (): Promise<void> => {
    console.log("[EmailWorker] Shutting down worker...");
    await emailWorker.close();
};
