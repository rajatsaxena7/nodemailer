const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const app = express();

app.use(express.json());

const sendEmail = async (req, res, template) => {
  const { to, roNumber, articleTitle, vendorName, vendorContact, attachmentUrl,notesheetNumber,amount,dateOfApproval,advertisementNumber} = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ashutosh@gully2global.com',
      pass: 'Ashutosh@!23',
    },
   
  });

  let mailOptions = {
    from: 'ashutosh@gully2global.com',
    to: to,
    subject: '',
    text: '',
    attachments: [],
  };

  switch (template) {
    case 'release-order':
      mailOptions.subject = `Release Order for Publication - ${roNumber}`;
      mailOptions.text = `Dear Newspaper,

I hope this email finds you well.

Please find attached the Release Order ${roNumber} for the article that is scheduled for publication. Please review the attached Release Order and approve/reject it from your dashboard for publication. Your prompt attention to this matter is appreciated to ensure timely publication.
For any further clarifications or modifications, please feel free to reach out to us. Thank you for your cooperation.

Best regards,
ADVT-Cell
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;



      
      case 'accepting':
      mailOptions.subject = `  Approval Notification for Release Order ${roNumber}.`;
      mailOptions.text = `Dear ADVT-Cell,

We are pleased to inform you that the Release Order ${roNumber} for the article has been approved by the Deputy Director and sent for approval to the vendor.



Thank you for your attention to this matter.



Best regards,
Deputy Director
Department of Information and Public Relations
Government of Arunachal Pradesh`;

break;





case 'billRaisedDeputy':
      mailOptions.subject = `Action Required: Review and Process Bill for RO Number ${roNumber}`;
      mailOptions.text = `Dear Deputy Director,

I hope this email finds you well.

This is to inform you that a bill has been raised by ${vendorName} for the publication of the article bearing RO Number ${roNumber}.
Please review the bill and process it accordingly. You can view the details and approve/reject the bill from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
${vendorName}
${vendorContact}
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;
  

case 'billRaisedCtd':
      mailOptions.subject = `Notification: Bill Raised for RO Number ${roNumber}`;
      mailOptions.text = `Dear Caseworker,

I hope this email finds you well.

This is to inform you that a bill has been raised by [vendorname] for the publication of the article bearing RO Number ${roNumber}, which was sent by you through Deputy Director approval.



Thank you for your prompt attention to this matter.

Best regards,
Deputy Director
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


  case 'assistantBill':
      mailOptions.subject = `Action Required: Review and Process Bill for RO Number ${roNumber}`;
      mailOptions.text = `Dear Assistant,

I hope this email finds you well.

This is to inform you that a bill has been raised by ${vendorName} for the publication of the article bearing RO Number ${roNumber} and has been sent to you for processing.
Please review the bill and process it accordingly. You can view the details and approve or reject the bill from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
${vendorName}
${vendorContact}
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;



      
 case 'notesheetcreate':
      mailOptions.subject = ` Request for Review and Action: Notesheet ${notesheetNumber} for Release Order ${roNumber}`;
      mailOptions.text = `Dear Deputy Director,

I hope this email finds you well.

This is to inform you that a notesheet has been created with Notesheet No. ${notesheetNumber} and an amount of ${amount} for the sent Release Order ${roNumber}.
Please review the bill and process it accordingly. You can view the details and approve or reject the bill from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
Assistant
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


 case 'faoNotesheet':
      mailOptions.subject = `Review Request for Notesheet ${notesheetNumber} for Release Order ${roNumber}`;
      mailOptions.text = `Dear FAO,

I hope this email finds you well.

This is to inform you that a notesheet has been created with Notesheet No. ${notesheetNumber} and an amount of ${amount} for the Release Order ${roNumber}.
Please review the notesheet and provide your response by either adding your notes or rejecting it. You can view the details and approve or reject the bill from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
Deputy Director
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;
      
 case 'directorNotesheet':
      mailOptions.subject = `Review and Approval Request for Notesheet ${notesheetNumber}`;
      mailOptions.text = `Dear Director,

I hope this email finds you well.

This is to inform you that a notesheet has been created with Notesheet No. ${notesheetNumber} and an associated amount of ${amount} pertaining to the Release Order ${roNumber}.
Please review the notesheet and provide your response by either adding your notes or rejecting it. You can view the details and approve or reject the notesheet from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
FAO
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;



   case 'secretaryNotesheet':
      mailOptions.subject = `Approval Needed: Notesheet ${notesheetNumber}`;
      mailOptions.text = `Dear Secretary,

I hope this email finds you well.

A notesheet with No. ${notesheetNumber} and amount [amount] related to Release Order ${roNumber} requires your approval.
Please review the details and indicate your decision via your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
Director
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


 case 'uploadSanction':
      mailOptions.subject = `Action Required: Upload Sanction Letter for Notesheet ${notesheetNumber}`;
      mailOptions.text = `Dear Assistant,

I hope this email finds you well.

This is to inform you that the Notesheet ${notesheetNumber} for the article has been accepted.
Please view the details and upload the sanction letter if approved. You can either approve or reject it from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
Secretary
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


 case 'approvalSanction':
      mailOptions.subject = `Action Required: View and Submit Approval for Sanction letter`;
      mailOptions.text = `Dear Accountant,

I hope this email finds you well.

This is to inform you that the Sanction letter for the article has been uploaded.
Please view the details and, if approved, submit the sanction letter. You can either approve or reject it from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
Assistant
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;

    
    
    case 'approvedTFao':
      mailOptions.subject = ` Approval Notification for Notesheet ${notesheetNumber} `;
      mailOptions.text = `Dear FAO,

I hope this email finds you well.


This is to inform you that the notesheet with Notesheet No. ${notesheetNumber} has been approved on ${dateOfApproval}.

Please review the approval details at your earliest convenience.

Thank you for your prompt attention to this matter.

Best regards,
Accountant
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


 case 'approvedTCase':
      mailOptions.subject = `Approval and Acknowledgement of Advertisement ${advertisementNumber}`;
      mailOptions.text = `Dear Caseworker,

I hope this email finds you well.

This is to inform you that the advertisement with Release Order Number ${roNumber} has been approved and acknowledged by ${vendorName}.


Thank you for your prompt attention to this matter.

Best regards,
Accountant
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;

 case 'approvedTDd':
      mailOptions.subject = `Approval and Acknowledgement of Advertisement ${advertisementNumber}`;
      mailOptions.text = `Dear Deputy Director,

I hope this email finds you well.

This is to inform you that the advertisement with Release Order Number ${roNumber} has been approved and acknowledged by ${vendorName}.


Thank you for your  attention to this matter.

Best regards,
Accountant
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;


 case 'approvedTDCase':
      mailOptions.subject = `Approval and Acknowledgement of Advertisement ${advertisementNumber}`;
      mailOptions.text = `Dear Caseworker,

I hope this email finds you well.

This is to inform you that the advertisement with Release Order Number ${roNumber} has been approved and acknowledged by ${vendorName}.


Thank you for your  attention to this matter.

Best regards,
Deputy Director
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;
      
      case 'vendorreply':
      mailOptions.subject = `  Acceptance of Release Order ${roNumber} by ${vendorName}`;
      mailOptions.text = `Dear Deputy Director,

We would like to inform you that the Release Order ${roNumber} for the article has been accepted by  ${vendorName}, and the bill will be raised accordingly.

Thank you for your attention to this matter.



Best regards,
${vendorName}
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;






      

    case 'approval-request':
      mailOptions.subject = `Request for Approval - Release Order for ${articleTitle}`;
      mailOptions.text = `Greetings sir,

I hope this email finds you well.

Please find attached the Release Order ${roNumber} for your review and approval.

Kindly provide your approval or any necessary modifications at your earliest convenience, so we can proceed with sending it to the newspaper vendors.
Thank you for your attention to this matter.

Best regards,
ADVT-Cell
Department of Information and Public Relations
Government of Arunachal Pradesh`;
      break;

    case 'ro-status':
      mailOptions.subject = `Status Update: Release Order [Accepted/Rejected] for RO number ${roNumber}`;
      mailOptions.text = `Dear ADVT-Cell,

We would like to inform you that the Release Order ${roNumber} for the article has been [accepted/rejected] by ${vendorName}.

If the Release Order has been rejected, please review the feedback provided and take the necessary actions.

Thank you for your attention to this matter.

Best regards,
${vendorName}
${vendorContact}`;
      break;

    case 'bill-raised':
      mailOptions.subject = `Action Required: Bill Raised for Published Article bearing RO Number ${roNumber}`;
      mailOptions.text = `Dear ADVT-Cell,

This is to inform you that a bill has been raised by ${vendorName} for the publication of the article bearing RO Number ${roNumber}.

Please review the bill and process it accordingly. You can view the details and approve/reject the bill from your dashboard.

Thank you for your prompt attention to this matter.

Best regards,
${vendorName}
${vendorContact}`;
      break;

    default:
      mailOptions.subject = req.body.subject;
      mailOptions.text = `Attention Required,

We are reaching out to inform you for the following:

${req.body.text} 
Please take the necessary action.

Best regards,`;
  }

  // Only attempt to add an attachment if an attachment URL is provided
  if (attachmentUrl) {
    try {
      const response = await axios.get(attachmentUrl, { responseType: 'arraybuffer' });
      // Add the attachment to the mail options
      mailOptions.attachments.push({
        filename: 'attachment.png', // Adjust filename as needed
        content: response.data,
      });
    } catch (error) {
      return res.status(500).send({ error: `Failed to fetch attachment: ${error.toString()}` });
    }
  }

  // Attempt to send the email (with or without the attachment)
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent' + (attachmentUrl ? ' with attachment' : '') });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

// Original send-email endpoint
app.post('/send-email', (req, res) => sendEmail(req, res, 'default'));

// New endpoints
app.post('/email/release-order', (req, res) => sendEmail(req, res, 'release-order'));
app.post('/email/billRaisedDeputy', (req, res) => sendEmail(req, res, 'billRaisedDeputy'));
app.post('/email/billRaisedCtd', (req, res) => sendEmail(req, res, 'billRaisedCtd'));
app.post('/email/notesheetcreate', (req, res) => sendEmail(req, res, 'notesheetcreate'));
app.post('/email/assistantBill', (req, res) => sendEmail(req, res, 'assistantBill'));

app.post('/email/faoNotesheet', (req, res) => sendEmail(req, res, 'faoNotesheet'));

app.post('/email/directorNotesheet', (req, res) => sendEmail(req, res, 'directorNotesheet'));


app.post('/email/secretaryNotesheet', (req, res) => sendEmail(req, res, 'secretaryNotesheet'));


app.post('/email/uploadSanction', (req, res) => sendEmail(req, res, 'uploadSanction'));

app.post('/email/approvalSanction', (req, res) => sendEmail(req, res, 'approvalSanction'));

app.post('/email/approvedTFao', (req, res) => sendEmail(req, res, 'approvedTFao'));

app.post('/email/approvedTCase', (req, res) => sendEmail(req, res, 'approvedTCase'));

app.post('/email/approvedTDCase', (req, res) => sendEmail(req, res, 'approvedTDCase'));

app.post('/email/approvedTDd', (req, res) => sendEmail(req, res, 'approvedTDd'));




app.post('/email/vendorreply', (req, res) => sendEmail(req, res, 'vendorreply'));
app.post('/email/accepting', (req, res) => sendEmail(req, res, 'accepting'));
app.post('/email/approval-request', (req, res) => sendEmail(req, res, 'approval-request'));
app.post('/email/ro-status', (req, res) => sendEmail(req, res, 'ro-status'));
app.post('/email/bill-raised', (req, res) => sendEmail(req, res, 'bill-raised'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
