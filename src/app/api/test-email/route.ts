import { NextResponse } from 'next/server';
import { sendMembershipConfirmation } from '@/app/lib/email';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, tier } = await request.json();
    
    if (!email || !firstName || !lastName || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName, tier' },
        { status: 400 }
      );
    }

    console.log('Testing email send to:', email);
    
    const result = await sendMembershipConfirmation(
      email,
      firstName,
      lastName,
      tier
    );

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      error: result.error || null,
      emailSettings: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER ? 'Set' : 'Not set',
        smtpFrom: process.env.SMTP_FROM
      }
    });
    
  } catch (error) {
    console.error('Email test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        emailSettings: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER ? 'Set' : 'Not set',
          smtpFrom: process.env.SMTP_FROM
        }
      },
      { status: 500 }
    );
  }
} 