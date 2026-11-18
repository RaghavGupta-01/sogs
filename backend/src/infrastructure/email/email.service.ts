export interface SendEmailOptions {
    from?: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export interface SendEmailResult {
    success: boolean;
    messageId?: string;
}

export interface EmailService {
    sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
}
