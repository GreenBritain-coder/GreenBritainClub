import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendMembershipConfirmation(
  email: string, 
  firstName: string, 
  lastName: string, 
  tier: string
) {
  try {
    const transporter = createTransporter();

    // Determine tier details
    const tierDetails = {
      sapphire: {
        name: 'Sapphire (Free)',
        price: 'Free',
        benefits: [
          'Access to basic blog content',
          'Monthly newsletter',
          'Community forum access',
          'Limited discount offers'
        ]
      },
      ruby: {
        name: 'Ruby',
        price: '£10/month',
        benefits: [
          'All Sapphire benefits',
          'Exclusive premium content',
          'Priority customer support',
          '10% discount on all products',
          'Monthly cannabis samples'
        ]
      },
      diamond: {
        name: 'Diamond',
        price: '£15.99/month',
        benefits: [
          'All Ruby benefits',
          'VIP event invitations',
          'Early access to new products',
          '20% discount on all products',
          'Premium sample packages',
          'Personal cannabis consultant'
        ]
      }
    };

    const currentTier = tierDetails[tier as keyof typeof tierDetails] || tierDetails.sapphire;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to GreenBritain.Club</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .tier-badge { background: #059669; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
          .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefit-item { padding: 5px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Welcome to GreenBritain.Club!</h1>
            <p>Your premium cannabis community</p>
          </div>
          
          <div class="content">
            <h2>Hello ${firstName} ${lastName}!</h2>
            
            <p>Thank you for joining GreenBritain.Club! Your membership registration has been successfully completed.</p>
            
            <div class="tier-badge">
              ${currentTier.name} - ${currentTier.price}
            </div>
            
            <div class="benefits">
              <h3>Your Membership Benefits:</h3>
              ${currentTier.benefits.map(benefit => `<div class="benefit-item">✅ ${benefit}</div>`).join('')}
            </div>
            
            ${tier !== 'sapphire' ? `
              <p><strong>Important:</strong> Your premium membership billing will be processed separately. You'll receive payment information within 24 hours.</p>
            ` : ''}
            
            <p>To get started:</p>
            <ul>
              <li>📖 Explore our <a href="https://greenbritain.club/blog">blog content</a></li>
              <li>💬 Join our community discussions</li>
              <li>📧 Watch for our newsletter</li>
              ${tier !== 'sapphire' ? '<li>🎁 Expect your welcome package soon!</li>' : ''}
            </ul>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Welcome to the family!</p>
            <p><strong>The GreenBritain.Club Team</strong></p>
          </div>
          
          <div class="footer">
            <p>GreenBritain.Club | Premium Cannabis Community</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Welcome to GreenBritain.Club!

Hello ${firstName} ${lastName}!

Thank you for joining GreenBritain.Club! Your ${currentTier.name} membership registration has been successfully completed.

Your Membership Benefits:
${currentTier.benefits.map(benefit => `✅ ${benefit}`).join('\n')}

${tier !== 'sapphire' ? 'Important: Your premium membership billing will be processed separately. You\'ll receive payment information within 24 hours.\n' : ''}

To get started:
- Explore our blog content at https://greenbritain.club/blog
- Join our community discussions
- Watch for our newsletter
${tier !== 'sapphire' ? '- Expect your welcome package soon!' : ''}

If you have any questions, feel free to contact our support team.

Welcome to the family!
The GreenBritain.Club Team

GreenBritain.Club | Premium Cannabis Community
This email was sent to ${email}
    `;

    await transporter.sendMail({
      from: `"GreenBritain.Club" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to GreenBritain.Club - ${currentTier.name} Membership Confirmed!`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Membership confirmation email sent to ${email}`);
    return { success: true };
    
  } catch (error) {
    console.error('Failed to send membership confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 