
// /lib/email/utils.ts

// Remove 'use server' and add server-only import
import 'server-only';
import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

// Create email transporter
export function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

// Get email configuration from environment
export function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    user: process.env.SMTP_USER!,
    password: process.env.SMTP_PASSWORD!,
    from: process.env.SMTP_FROM!,
  };
}

// Send email function
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  try {
    const config = getEmailConfig();
    const transporter = createTransporter(config);
    
    const result = await transporter.sendMail({
      from: config.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });
    
    console.log('✅ Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

/**
 * Test email configuration - Only use this in server components/actions
 */
export async function testEmailConfig(): Promise<{ success: boolean; message: string }> {
  try {
    const config = getEmailConfig();
    const transporter = createTransporter(config);
    
    // Verify connection configuration
    await transporter.verify();
    
    return {
      success: true,
      message: 'Email configuration is valid and ready to send emails',
    };
  } catch (error: any) {
    console.error('❌ Email configuration test failed:', error);
    return {
      success: false,
      message: `Email configuration test failed: ${error.message}`,
    };
  }
}