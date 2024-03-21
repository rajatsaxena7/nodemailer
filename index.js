const express = require('express');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { to, subject, text } = req.body;

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
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
