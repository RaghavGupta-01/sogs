import nodemailer, { type Transporter } from "nodemailer";
import type { EmailService, SendEmailOptions, SendEmailResult } from "../email.service.js";

export interface GmailProviderConfig {
    user?: string;
    pass?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    from?: string;
}

export class GmailProvider implements EmailService {
    private readonly transporter: Transporter;
    private readonly defaultFrom: string;

    constructor(config?: GmailProviderConfig) {
        const user = config?.user ?? process.env.SMTP_USER ?? process.env.GMAIL_USER;
        const pass = config?.pass ?? process.env.SMTP_PASS ?? process.env.GMAIL_APP_PASSWORD;
        const host = config?.host ?? process.env.SMTP_HOST ?? "smtp.gmail.com";
        const port = config?.port ?? (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587);
        const secure = config?.secure ?? (process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465);

        this.defaultFrom = config?.from ?? process.env.EMAIL_FROM ?? (user ? `"SOGS" <${user}>` : "");

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
        });
    }

    async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
        const fromAddress = options.from ?? this.defaultFrom;

        if (!fromAddress) {
            throw new Error("GmailProvider: No sender email address configured.");
        }

        try {
            const info = await this.transporter.sendMail({
                from: fromAddress,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.error(`GmailProvider: Failed to send email to ${options.to}:`, error);
            throw error;
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error("GmailProvider: Transporter verification failed:", error);
            return false;
        }
    }
}
