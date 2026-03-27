export function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

export function getOtpHtml(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          
          <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            
            <tr>
              <td align="center">
                <h2 style="margin-bottom:10px;">OTP Verification</h2>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="color:#555;">Your OTP code is:</p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="font-size:28px; font-weight:bold; color:#333; margin:20px 0;">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="font-size:12px; color:#888;">
                  This OTP is valid for 5 minutes. Do not share it with anyone.
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
}