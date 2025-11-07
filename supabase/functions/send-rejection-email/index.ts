import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  name: string;
  collegeName: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, collegeName, reason }: EmailRequest = await req.json();
    
    console.log("Sending rejection email to:", to);

    const smtpHost = Deno.env.get("SMTP_HOST") || "";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER") || "";
    const smtpPass = Deno.env.get("SMTP_PASSWORD") || "";

    // Create email content
    const subject = "Update on Your SkillQuiz Champ Connection Request";
    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillQuiz Champ Connection Request</h1>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Thank you for your interest in connecting <strong>${collegeName}</strong> to SkillQuiz Champ platform.</p>
      
      <div class="message-box">
        <h3>Connection Request Status: Not Approved</h3>
        <p>After careful review, we are unable to approve your connection request at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>If you have any questions or would like to reapply in the future, please feel free to contact us.</p>
      
      <div class="footer">
        <p>Best regards,<br>SkillQuiz Champ Team</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Build email message
    const boundary = "boundary_" + Date.now();
    const message = [
      `From: SkillQuiz Champ <${smtpUser}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
      ``
    ].join("\r\n");

    // Connect to SMTP server
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readResponse = async (): Promise<string> => {
      const buffer = new Uint8Array(4096);
      const n = await conn.read(buffer);
      const response = decoder.decode(buffer.subarray(0, n || 0));
      console.log("SMTP:", response.trim());
      return response;
    };

    const sendCommand = async (command: string): Promise<string> => {
      await conn.write(encoder.encode(command + "\r\n"));
      return await readResponse();
    };

    try {
      // Read server greeting
      await readResponse();

      // Send EHLO
      await sendCommand(`EHLO ${smtpHost}`);

      // Start TLS
      await sendCommand("STARTTLS");

      // Upgrade to TLS connection
      const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });

      const tlsReadResponse = async (): Promise<string> => {
        const buffer = new Uint8Array(4096);
        const n = await tlsConn.read(buffer);
        const response = decoder.decode(buffer.subarray(0, n || 0));
        console.log("SMTP TLS:", response.trim());
        return response;
      };

      const tlsSendCommand = async (command: string): Promise<string> => {
        await tlsConn.write(encoder.encode(command + "\r\n"));
        return await tlsReadResponse();
      };

      // Send EHLO again after TLS
      await tlsSendCommand(`EHLO ${smtpHost}`);

      // Authenticate
      await tlsSendCommand("AUTH LOGIN");
      await tlsSendCommand(btoa(smtpUser));
      await tlsSendCommand(btoa(smtpPass));

      // Send email
      await tlsSendCommand(`MAIL FROM:<${smtpUser}>`);
      await tlsSendCommand(`RCPT TO:<${to}>`);
      await tlsSendCommand("DATA");
      await tlsConn.write(encoder.encode(message + "\r\n.\r\n"));
      await tlsReadResponse();

      // Quit
      await tlsSendCommand("QUIT");

      tlsConn.close();
    } catch (error) {
      conn.close();
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending rejection email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});