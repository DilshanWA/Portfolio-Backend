const express = require('express');
const app = express();
const port = 5000;
cors = require('cors');
const { db } = require('./config/firebasedb');
const nodemailer = require('nodemailer');
require('dotenv').config();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Firebase connected successfully 🚀");
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dilshan.personal12@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
})

app.post('/message', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).send({ error: 'All fields are required.' });
    }

    await db.collection('messages').add({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });
    
    const mailOptions = {
        from: 'Personal Portfolio <dilshan.personal12@gmail.com>',
        to: 'dilshan.personal12@gmail.com',
        subject: subject,
        html :`
          <h3>New Message from Your Portfolio</h3>
          <h3>${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/> ${message}</p>
        `
    }
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Message & Notification sent successfully.' });


  } catch (error) {
    console.error(error);

    res.status(500).send({ error: 'Failed to send message.' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
