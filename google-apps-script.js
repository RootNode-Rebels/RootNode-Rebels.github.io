// ---------------------------------------------------------------------------------
// RootNode Rebels - Google Apps Script (Resend API Proxy + Sheets)
// ---------------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to script.google.com and click "New Project".
// 2. Delete the default code and paste this entire script.
// 3. Replace "re_YOUR_RESEND_API_KEY" with your actual Resend key.
// 4. Click "Deploy" > "New deployment" -> "Web app".
// 5. Set "Execute as" to "Me" and "Who has access" to "Anyone".
// 6. Copy the Web App URL and paste it into script.js!
// ---------------------------------------------------------------------------------

const RESEND_API_KEY = "re_YOUR_RESEND_API_KEY"; 
const SHEET_NAME = "Sheet1";
const ADMIN_EMAIL = "founder@rootnoderebels.com";
const SENDER_EMAIL = "hello@rootnoderebels.com";

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    const name = data.name || "Unknown";
    const email = data.email || "No Email";
    const message = data.message || "";
    const timestamp = new Date();

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([timestamp, name, email, message]);

    sendResendEmail(name, email, message);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Data logged and emails dispatched."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendResendEmail(clientName, clientEmail, clientMessage) {
  const resendUrl = "https://api.resend.com/emails";
  
  const adminPayload = {
    from: `RootNode Rebels System <${SENDER_EMAIL}>`,
    to: [ADMIN_EMAIL],
    subject: `🚨 New Lead: ${clientName}`,
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      <p><strong>Message:</strong><br>${clientMessage}</p>
    `
  };

  const clientPayload = {
    from: `RootNode Rebels <${SENDER_EMAIL}>`,
    to: [clientEmail],
    subject: `We received your message, ${clientName}!`,
    html: `
      <h2>Hello ${clientName},</h2>
      <p>Thank you for reaching out to <strong>RootNode Rebels</strong>. We have received your message and our team will get back to you shortly.</p>
      <br>
      <p>Best Regards,<br>Adarsh B A, Founder & CEO</p>
    `
  };

  const options = {
    method: "post",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };

  options.payload = JSON.stringify(adminPayload);
  UrlFetchApp.fetch(resendUrl, options);

  options.payload = JSON.stringify(clientPayload);
  UrlFetchApp.fetch(resendUrl, options);
}
