const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { db } = require("./config/firebasedb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.send("Firebase connected successfully 🚀");
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dilshan.personal12@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

// API route
app.post("/message", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await db.collection("messages").add({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    await transporter.sendMail({
      from: "Personal Portfolio <dilshan.personal12@gmail.com>",
      to: "dilshan.personal12@gmail.com",
      subject,
      html: `
        <h3>New Message from Your Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.status(200).json({ message: "Message & notification sent successfully." });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// ❌ DO NOT use app.listen()
// ✅ Export app for Vercel
module.exports = app;
