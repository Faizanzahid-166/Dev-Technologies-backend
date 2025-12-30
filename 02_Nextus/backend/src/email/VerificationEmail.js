// Plain JS email template for verification OTP
export default function VerificationEmail({ name, otp, verifyUrl }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; }
          h1 { color: #333; }
          p { color: #555; font-size: 16px; }
          .otp { font-size: 24px; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; padding: 10px 20px; background: #0070f3; color: #fff; text-decoration: none; border-radius: 5px; }
          .footer { font-size: 12px; color: #aaa; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello ${name},</h1>
          <p>Use the following OTP to verify your email address:</p>
          <div class="otp">${otp}</div>
          <p>Or click the button below to verify:</p>
          <a href="${verifyUrl}" class="button">Verify Email</a>
          <p class="footer">If you didn't request this, you can ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}
