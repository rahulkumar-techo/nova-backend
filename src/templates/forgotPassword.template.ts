/**
 * forgotPasswordTemplate
 * -------------------------------------------------------
 * Generates a professional, responsive HTML email template
 * for password reset using OTP verification.
 * Designed for NovaNoteX and works with Nodemailer or any email API.
 */

interface ForgotPasswordTemplateOptions {
  name: string;
  otp: string;
  appUrl?: string;
}

export const forgotPasswordTemplate = ({
  name,
  otp,
  appUrl = "https://novanotex.com",
}: ForgotPasswordTemplateOptions): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset - NovaNoteX</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f8fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      <tr>
        <td style="padding:30px;text-align:center;">
          <h2 style="color:#4F46E5;font-size:26px;margin-bottom:10px;">Reset Your Password 🔐</h2>
          <p style="color:#444;font-size:16px;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;font-size:15px;line-height:1.5;">
            We received a request to reset your <strong>NovaNoteX</strong> account password.
            <br/><br/>
            Please use the OTP below to proceed with resetting your password:
          </p>

          <div style="margin:25px 0;">
            <span style="display:inline-block;font-size:32px;letter-spacing:6px;color:#4F46E5;background:#EEF2FF;padding:15px 25px;border-radius:10px;font-weight:bold;">
              ${otp}
            </span>
            <div style="margin-top:8px;font-size:14px;color:#888;">Valid for 5 minutes ⏱️</div>
          </div>

          <a href="${appUrl}/reset-password" 
             style="display:inline-block;background:#4F46E5;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:500;margin-top:20px;">
            Reset Password
          </a>

          <p style="margin-top:35px;color:#666;font-size:13px;line-height:1.5;">
            If you didn’t request a password reset, please ignore this email.
            Your account remains secure.
          </p>
        </td>
      </tr>
    </table>

    <p style="text-align:center;font-size:12px;color:#aaa;margin-top:20px;">
      © ${new Date().getFullYear()} NovaNoteX. All rights reserved.
    </p>
  </body>
  </html>
  `;
};
