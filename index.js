const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(express.json());

let transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Your email provider's SMTP host
  port: 465, // Typically 587 for secure SMTP
  secure: false, // True for 465, false for other ports
  auth: {
    user: 'dannyanime367@gmail.com', // Your email
    pass: 'Ashutosh@!23', // Your email password or app-specific password
  },
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  
  let mailOptions = {
    from: 'ashutosh@gully2global.com',
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
