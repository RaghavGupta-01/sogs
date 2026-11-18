import type { EmailService } from "./email.service.js";
import { ConsoleProvider } from "./providers/console.provider.js";

export type EmailProviderType = "console";

export class EmailFactory {
    private static instance: EmailService | null = null;

    static create(providerType?: string): EmailService {
        const type = (providerType ?? process.env.EMAIL_PROVIDER ?? "console").toLowerCase();

        switch (type) {
            case "console":
                return new ConsoleProvider();

            default:
                throw new Error(`Unsupported email provider: "${type}". Supported providers: console.`);
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
