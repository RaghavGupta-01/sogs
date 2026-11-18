import { EmailFactory } from "../src/infrastructure/email/index.js";

const emailService = EmailFactory.getInstance();

const result = await emailService.sendEmail({
    to: "test@example.com",
    subject: "Test SOGS Email",
    text: "Hello! This is a test email sent via EmailFactory.",
    html: "<p>Hello! This is a test email sent via <strong>EmailFactory</strong>.</p>",
});

console.log("Send result:", result);
