import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn('Email configuration not found. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send reset password email
export const sendResetPasswordEmail = async (email, resetToken, userName = 'User') => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email transporter not configured. Skipping email send.');
    return false;
  }

  try {
    // In production, use your frontend URL from environment
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - NetVerse',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #555;
            }
            .message {
              margin-bottom: 30px;
              color: #666;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #999;
            }
            .footer a {
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 NetVerse</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${userName},</p>
              <p class="message">
                We received a request to reset your password for your NetVerse account. 
                If you didn't make this request, you can safely ignore this email.
              </p>
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes for your security.
              </div>
              <p class="message">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p class="message" style="word-break: break-all; color: #667eea;">
                ${resetUrl}
              </p>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} NetVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reset password email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email transporter not configured. Skipping email send.');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"NetVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to NetVerse! 🎉',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to NetVerse</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #555;
            }
            .message {
              margin-bottom: 20px;
              color: #666;
            }
            .features {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .features ul {
              margin: 0;
              padding-left: 20px;
            }
            .features li {
              margin: 10px 0;
              color: #555;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to NetVerse!</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${userName},</p>
              <p class="message">
                We're thrilled to have you join our community! Your account has been successfully created, 
                and you're all set to start connecting with others.
              </p>
              <div class="features">
                <strong>Here's what you can do with NetVerse:</strong>
                <ul>
                  <li>📝 Create and share posts</li>
                  <li>📸 Share stories that expire in 24 hours</li>
                  <li>👥 Follow and connect with others</li>
                  <li>💬 Chat in real-time</li>
                  <li>❤️ Like and comment on posts</li>
                </ul>
              </div>
              <div class="button-container">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" class="cta-button">Get Started</a>
              </div>
              <p class="message">
                If you have any questions or need help, don't hesitate to reach out to our support team.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NetVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};