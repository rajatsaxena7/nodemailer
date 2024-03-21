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

  // Fetch the attachment from the URL
  let attachment;
  try {
    const response = await axios.get(attachmentUrl, { responseType: 'arraybuffer' });
    attachment = response.data;
  } catch (error) {
    return res.status(500).send(`Failed to fetch attachment: ${error.toString()}`);
  }

  let mailOptions = {
    from: 'ashutosh@gully2global.com',
    to: to,
    subject: subject,
    text: text,
    attachments: [
      {
        // Specify filename or it will be derived from the URL
        filename: 'attachment.png', // Example filename, you might want to dynamically set this based on the URL or content type
        content: attachment,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent with attachment');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
