const express = require('express'); // Not used in Vercel serverless functions
const nodemailer = require('nodemailer');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { to, subject, text, attachmentUrl } = req.body;

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
    subject: subject,
    text: text,
    // Initialize attachments as an empty array; it may be filled later
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
    res.status(200).send('Email sent' + (attachmentUrl ? ' with attachment' : ''));
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
