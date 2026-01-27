import { SubscriptionTier, UserSubscription, UsageStats } from "../../shared/subscription-types.js";
import nodemailer from 'nodemailer';

export interface IEmailService {
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendUpgradeConfirmation(email: string, name: string, planName: string, price: number): Promise<void>;
    sendLowCreditWarning(email: string, name: string, remaining: number, total: number): Promise<void>;
    sendCancellationNotice(email: string, name: string, endDate: string): Promise<void>;
}

export class EmailService implements IEmailService {
    private static instance: EmailService;
    private transporter: nodemailer.Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    private async sendEmail(to: string, subject: string, html: string) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('[EmailService] SMTP credentials not found. Logging email instead.');
            console.log(`To: ${to} | Subject: ${subject}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"DeenAkDiamano" <no-reply@deenakdiamano.com>',
                to,
                subject,
                html
            });
            console.log(`[EmailService] Email sent to ${to}`);
        } catch (error) {
            console.error('[EmailService] Failed to send email:', error);
        }
    }

    public async sendWelcomeEmail(email: string, name: string): Promise<void> {
        const subject = "Welcome to XamSa Dine AI!";
        const html = `
            <h2>Salaam ${name},</h2>
            <p>Welcome to XamSa Dine AI. You are currently on the <strong>Free Tier</strong>.</p>
            <p>Explore our features and upgrade whenever you are ready to unlock more capabilities.</p>
            <br>
            <p>Best regards,<br>The Platform Team</p>
        `;
        return this.sendEmail(email, subject, html);
    }

    public async sendUpgradeConfirmation(email: string, name: string, planName: string, price: number): Promise<void> {
        const subject = "Subscription Upgraded - XamSa Dine AI";
        const html = `
            <h2>Salaam ${name},</h2>
            <p>You have successfully upgraded to the <strong>${planName}</strong> plan.</p>
            <p><strong>Price:</strong> ${price} FCFA/month</p>
            <p>JazakAllah Khair for your support! You now have access to premium features.</p>
        `;
        return this.sendEmail(email, subject, html);
    }

    public async sendLowCreditWarning(email: string, name: string, remaining: number, total: number): Promise<void> {
        const subject = "Low Chat Credits Warning";
        const html = `
            <h2>Salaam ${name},</h2>
            <p>You have used over 80% of your chat credits.</p>
            <p><strong>Remaining Credits:</strong> ${remaining} / ${total}</p>
            <p>Please <a href="${process.env.VITE_APP_URL}/pricing">upgrade your plan</a> to continue without interruption.</p>
        `;
        return this.sendEmail(email, subject, html);
    }

    public async sendCancellationNotice(email: string, name: string, endDate: string): Promise<void> {
        const subject = "Subscription Cancellation";
        const html = `
            <h2>Salaam ${name},</h2>
            <p>Your subscription has been marked for cancellation.</p>
            <p>You will retain access to your plan benefits until <strong>${endDate}</strong>.</p>
            <p>We hope to see you again soon.</p>
        `;
        return this.sendEmail(email, subject, html);
    }
}

// Export singleton
export const emailService = EmailService.getInstance();
