const express = require('express'); // Not used in Vercel serverless functions
const nodemailer = require('nodemailer');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { to, subject, text, attachmentUrl } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.hostinger.com',
    SMTP-Auth : true,
    port: 587,
    SMTPSecure : 'tls',


    auth: {
      user: 'support@digi9.co.in',
      pass: 'Shasudigi@21',
      
    },
  });

  let mailOptions = {
    from: 'support@digi9.co.in',
    to: to,
    subject: subject,
    text: `Attention Required,

We are reaching out to inform you for the following:

${text} 
Please take the necessary action.

Best regards,
`,
    attachments: [],
  };

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
      return res.status(500).send(`Failed to fetch attachment: ${error.toString()}`);
    }
  }

  // Attempt to send the email (with or without the attachment)
 try {
    await transporter.sendMail(mailOptions);
    // Modify this line to send a JSON response
    res.status(200).send({ message: 'Email sent' + (attachmentUrl ? ' with attachment' : '') });
  } catch (error) {
    // Also, ensure error responses are in JSON
    res.status(500).send({ error: error.toString() });
  }
};
