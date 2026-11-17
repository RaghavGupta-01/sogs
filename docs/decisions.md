# ADR-001: Decouple Email Delivery from BullMQ Worker

## Context

While researching and evaluating email service providers such as Resend, Brevo, and Gmail SMTP (Nodemailer), several uncertainties and constraints emerged:

- Different providers have different free-tier usage limits.
- Some providers require a verified custom domain to send emails to arbitrary recipients.
- Provider-specific authentication and integration requirements vary.
- Deployment platforms may impose restrictions on SMTP ports and outbound connections.
- The email provider might need to change as the project evolves from local development to production.

Integrating a specific email provider directly into the BullMQ email worker would tightly couple the worker to that provider's implementation.

This would make switching providers more difficult and could require changes to the worker's existing logic.

## Decision

Introduce an independent email service abstraction that separates email delivery from the BullMQ queue and worker.

The implementation will use the Factory Method design pattern to instantiate an email provider based on environment configuration.

The initial architecture will consist of:

- **EmailService:** Defines the common email delivery contract.
- **GmailProvider:** Initial implementation using Nodemailer and Gmail SMTP.
- **BrevoProvider:** Potential future implementation.
- **ResendProvider:** Potential future implementation.
- **EmailFactory:** Creates the configured email provider.
- **EmailWorker:** Processes BullMQ jobs and delegates email delivery to the email service.

All providers must implement the same email delivery contract.

The BullMQ worker must remain unaware of the underlying email provider.

## Consequences

### Positive
- Email delivery is decoupled from BullMQ.
- Email providers can be replaced without modifying queue or worker logic.
- Provider-specific configuration remains isolated.
- Different providers can be evaluated without redesigning the email architecture.
- The application becomes easier to maintain, test, and extend.

### Trade-offs
- Introduces additional abstraction and files.
- Each new provider requires its own implementation and testing.
- Provider-specific features may require additional capabilities beyond the common email contract.

## Initial Implementation

Gmail SMTP using Nodemailer will be used for initial development and testing.

The provider can be replaced later depending on deployment constraints, sending limits, deliverability requirements, and project needs.

## Future Considerations

- Evaluate transactional email providers when moving towards production.
- Reassess free-tier limitations and custom-domain requirements.
- Introduce provider-specific delivery tracking where necessary.
- Ensure retry handling and duplicate-delivery considerations remain independent of the email provider.
