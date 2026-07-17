// ---------------------------------------------------------------------------------
// RootNode Rebels - Google Apps Script (Mail Automation Backend)
// ---------------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to script.google.com and click "New Project".
// 2. Delete the default code and paste this entire script.
// 3. Save the project as "RootNode Rebels Backend".
// 4. Click "Deploy" > "New deployment".
// 5. Select type "Web app".
// 6. Set "Execute as" to "Me" and "Who has access" to "Anyone".
// 7. Click Deploy, authorize the permissions, and copy the Web App URL.
// 8. Paste that URL into the scriptURL variable in your script.js file.
// ---------------------------------------------------------------------------------

const sheetName = 'Sheet1';
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Format the email message
    const htmlBody = `
      <h2>New Message from RootNode Rebels Website</h2>
      <p><strong>Name:</strong> ${e.parameter.Name}</p>
      <p><strong>Email:</strong> ${e.parameter.Email}</p>
      <p><strong>Message:</strong><br>${e.parameter.Message}</p>
    `;

    // Send the email directly to your inbox
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: "New Contact Form Submission - RootNode Rebels",
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
