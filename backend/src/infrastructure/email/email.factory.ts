import type { EmailService } from "./email.service.js";
import { ConsoleProvider } from "./providers/console.provider.js";
import { GmailProvider } from "./providers/gmail.provider.js";

export type EmailProviderType = "gmail" | "console";

export class EmailFactory {
    private static instance: EmailService | null = null;

    static create(providerType?: string): EmailService {
        const type = (providerType ?? process.env.EMAIL_PROVIDER ?? "console").toLowerCase();

        switch (type) {
            case "gmail":
                return new GmailProvider();

            case "console":
                return new ConsoleProvider();

            default:
                throw new Error(`Unsupported email provider: "${type}". Supported providers: gmail, console.`);
        }
    }

    static getInstance(): EmailService {
        if (!this.instance) {
            this.instance = this.create();
        }
        return this.instance;
    }

    static resetInstance(): void {
        this.instance = null;
    }
}
