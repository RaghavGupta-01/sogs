import type { EmailService, SendEmailOptions, SendEmailResult } from "../email.service.js";

export class ConsoleProvider implements EmailService {
    async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
        // Allow simulating failure during testing
        if (options.to.startsWith("fail") || options.to.includes("simulate-failure")) {
            throw new Error(`Simulated delivery failure for ${options.to}`);
        }

        // Allow simulating network latency for concurrency testing
        if (options.to.includes("slow")) {
            const delayMs = 1000;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        const messageId = `console-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        console.log("================ [EMAIL SENT] ================");
        console.log(`Message-ID : ${messageId}`);
        console.log(`To         : ${options.to}`);
        console.log(`From       : ${options.from ?? "default@sogs.local"}`);
        console.log(`Subject    : ${options.subject}`);
        if (options.text) {
            console.log(`Text Body  : ${options.text}`);
        }
        if (options.html) {
            console.log(`HTML Body  : ${options.html}`);
        }
        console.log("========================================================");

        return {
            success: true,
            messageId,
        };
    }
}
