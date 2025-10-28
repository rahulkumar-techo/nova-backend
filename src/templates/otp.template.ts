/**
 * otpTemplate
 * -------------------------------------
 * Generates a responsive HTML email template
 * with dynamic username, OTP, and optional app URL.
 * Designed for use with Nodemailer or any email service.
 */

interface OTPTemplateOptions {
  name: string;
  otp: string;
  appUrl?: string;
}

export const otpTemplate = ({
  name,
  otp,
  appUrl = "https://novanotex.com",
}: OTPTemplateOptions): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to NovaNoteX</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      <tr>
        <td style="padding:30px;text-align:center;">
          <h2 style="color:#4F46E5;font-size:26px;margin-bottom:10px;">
            Welcome to <span style="color:#3B82F6;">NovaNoteX</span> 🎉
          </h2>
          <p style="color:#444;font-size:16px;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;font-size:15px;line-height:1.5;">
            We're excited to have you join <strong>NovaNoteX</strong> — your smart e-learning companion!
            <br/><br/>
            Please verify your email address using the OTP code below:
          </p>

          <div style="margin:25px 0;">
            <span style="display:inline-block;font-size:32px;letter-spacing:6px;color:#4F46E5;background:#EEF2FF;padding:15px 25px;border-radius:10px;font-weight:bold;">
              ${otp}
            </span>
            <p style="margin-top:8px;color:#666;font-size:14px;">Valid for 5 minutes ⏱️</p>
          </div>

          <a href="${appUrl}" 
             style="display:inline-block;background:#4F46E5;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:500;">
            Go to NovaNoteX
          </a>

          <p style="margin-top:40px;color:#999;font-size:13px;">
            If you didn't sign up, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>

    <p style="text-align:center;font-size:12px;color:#aaa;margin-top:10px;">
      © ${new Date().getFullYear()} NovaNoteX. All rights reserved.
    </p>
  </body>
  </html>
  `;
};
