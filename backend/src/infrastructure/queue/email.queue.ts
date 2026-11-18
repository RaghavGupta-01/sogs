import { Queue, type JobsOptions } from "bullmq";
import { bullmqRedisOptions } from "../redis/redis.js";

export const EMAIL_QUEUE_NAME = "email-queue";
export const EMAIL_JOB_NAME = "send-email";

export interface EmailJobData {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
}

export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
    connection: bullmqRedisOptions,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: {
            count: 100,
        },
        removeOnFail: {
            count: 500,
        },
    },
});

export const addEmailJob = async (
    data: EmailJobData,
    options?: JobsOptions
) => {
    return await emailQueue.add(EMAIL_JOB_NAME, data, options);
};
