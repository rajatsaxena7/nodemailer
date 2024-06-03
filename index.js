const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const app = express();

app.use(express.json());

const sendEmail = async (req, res, template) => {
  const { to, roNumber, articleTitle, vendorName, vendorContact, attachmentUrl } = req.body;

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
app.post('/email/approval-request', (req, res) => sendEmail(req, res, 'approval-request'));
app.post('/email/ro-status', (req, res) => sendEmail(req, res, 'ro-status'));
app.post('/email/bill-raised', (req, res) => sendEmail(req, res, 'bill-raised'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
