const welcomeMail = () => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to NovaNoteX</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f7; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background:#ffffff; border-radius:10px; overflow:hidden;">
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <h1 style="color:#4F46E5; font-size:26px; margin-bottom:12px;">Welcome to NovaNoteX 🎉</h1>
                  <p style="color:#4b5563; font-size:15px; line-height:22px; margin:0 0 20px;">
                    We're excited to have you on board. NovaNoteX helps you organize handwritten notes into smart digital learning experiences.
                  </p>

                  <a href="https://novanotex.com"
                    style="display:inline-block; background:#4F46E5; color:#ffffff; padding:12px 22px;
                    border-radius:6px; text-decoration:none; font-size:15px; font-weight:600;">
                    Get Started
                  </a>

                  <p style="color:#6b7280; font-size:13px; line-height:20px; margin-top:28px;">
                    If you did not create this account, you can safely ignore this email.
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />

                  <p style="color:#9ca3af; font-size:12px; margin-top:0;">
                    © ${new Date().getFullYear()} NovaNoteX. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
  return htmlTemplate;
};
export default welcomeMail