import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { name, email, msg } = JSON.parse(event.body || "{}");

    if (!name || !email || !msg) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: name, email, msg" }),
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.RECEIVER_EMAIL || "theresejarvheden@gmail.com";
    
    // Using verified domain for sender. Default to info@theresejarvheden.se
    const senderEmail = process.env.SENDER_EMAIL || "info@theresejarvheden.se";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Email configuration error on server." }),
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Therese Järvheden Hemsida <${senderEmail}>`,
        to: receiverEmail,
        reply_to: email, // Direct replies in Gmail will go to the sender's email
        subject: `Meddelande från ${name} via theresejarvheden.se`,
        html: `
          <div style="font-family: sans-serif; padding: 25px; color: #1c1c1c; max-width: 600px; border: 1px solid #e0dcd1; border-radius: 4px; background-color: #fdfcf7;">
            <h2 style="color: #D88C5A; font-weight: 500; border-bottom: 1px solid #e0dcd1; padding-bottom: 12px; margin-top: 0; font-size: 20px; letter-spacing: 0.05em; text-transform: uppercase;">Nytt meddelande från hemsidan</h2>
            <div style="margin-top: 20px; font-size: 14px; line-height: 1.6;">
              <p style="margin: 6px 0;"><strong>Namn:</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>E-post:</strong> <a href="mailto:${email}" style="color: #D88C5A; text-decoration: none; border-bottom: 1px dotted #D88C5A;">${email}</a></p>
              <div style="margin-top: 24px; padding: 18px; background-color: #f5f3e9; border-left: 3px solid #D88C5A; font-style: italic; white-space: pre-wrap; color: #2c2c2c;">"${msg}"</div>
            </div>
            <hr style="border: 0; border-top: 1px solid #e0dcd1; margin-top: 30px;" />
            <p style="font-size: 11px; color: #8c887d; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0;">Detta mejl skickades från kontaktformuläret på theresejarvheden.se.</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error response:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to send email via Resend API." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: data.id }),
    };
  } catch (error: any) {
    console.error("Error in contact serverless function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
