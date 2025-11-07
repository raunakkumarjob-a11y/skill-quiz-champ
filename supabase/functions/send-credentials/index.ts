import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  name: string;
  collegeName: string;
  email: string;
  password: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, collegeName, email, password }: EmailRequest = await req.json();
    
    console.log("Sending credentials email to:", to);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      throw new Error("SMTP configuration is incomplete");
    }

    // Create email content
    const emailContent = `From: Skill Quiz Lab <${smtpUser}>
To: ${to}
Subject: Your Skill Quiz Lab Account Credentials
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .credential-row { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .value { font-family: monospace; background: #f0f0f0; padding: 5px 10px; border-radius: 4px; display: inline-block; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Welcome to Skill Quiz Lab</h1>
      <p>Your account has been approved!</p>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Congratulations! Your connection request for <strong>${collegeName}</strong> has been approved by our admin team.</p>
      <p>Your account credentials have been generated. Please keep this information secure:</p>
      
      <div class="credentials">
        <div class="credential-row">
          <span class="label">Email:</span>
          <span class="value">${email}</span>
        </div>
        <div class="credential-row">
          <span class="label">Password:</span>
          <span class="value">${password}</span>
        </div>
      </div>

      <p><strong>Important:</strong> We recommend changing your password after your first login for security purposes.</p>
      
      <p>You can now login at: <a href="${Deno.env.get("VITE_SUPABASE_URL")}/auth">Skill Quiz Lab</a></p>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The Skill Quiz Lab Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Skill Quiz Lab. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

    // Connect to SMTP server and send email
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readResponse = async () => {
      const buffer = new Uint8Array(4096);
      const n = await conn.read(buffer);
      if (n) {
        const response = decoder.decode(buffer.subarray(0, n));
        console.log("SMTP:", response.trim());
        return response;
      }
      return "";
    };

    const sendCommand = async (command: string) => {
      await conn.write(encoder.encode(command + "\r\n"));
      return await readResponse();
    };

    try {
      // Read server greeting
      await readResponse();
      
      // SMTP conversation
      await sendCommand(`EHLO ${smtpHost}`);
      await sendCommand("STARTTLS");
      
      // Upgrade connection to TLS
      const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });
      
      const tlsReadResponse = async () => {
        const buffer = new Uint8Array(4096);
        const n = await tlsConn.read(buffer);
        if (n) {
          const response = decoder.decode(buffer.subarray(0, n));
          console.log("TLS SMTP:", response.trim());
          return response;
        }
        return "";
      };

      const sendTlsCommand = async (command: string) => {
        await tlsConn.write(encoder.encode(command + "\r\n"));
        return await tlsReadResponse();
      };

      await sendTlsCommand(`EHLO ${smtpHost}`);
      await sendTlsCommand("AUTH LOGIN");
      await sendTlsCommand(btoa(smtpUser));
      await sendTlsCommand(btoa(smtpPassword));
      await sendTlsCommand(`MAIL FROM:<${smtpUser}>`);
      await sendTlsCommand(`RCPT TO:<${to}>`);
      await sendTlsCommand("DATA");
      
      // Send email content and terminate with CRLF.CRLF
      await tlsConn.write(encoder.encode(emailContent + "\r\n.\r\n"));
      await tlsReadResponse();
      
      await sendTlsCommand("QUIT");

      tlsConn.close();
    } catch (error) {
      conn.close();
      throw error;
    }

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Credentials sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
