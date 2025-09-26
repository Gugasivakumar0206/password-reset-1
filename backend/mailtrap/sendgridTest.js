// backend/mailtrap/sendgridTest.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "tcdsthindal@gmail.com", // ✅ your test recipient email
  from: process.env.SENDER_EMAIL, // ✅ must be your verified sender in SendGrid
  subject: "SendGrid Test Email",
  text: "Hello, this is a test email from SendGrid!",
  html: "<strong>Hello, this is a test email from SendGrid!</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("✅ Test email sent successfully");
  })
  .catch((error) => {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
  });
