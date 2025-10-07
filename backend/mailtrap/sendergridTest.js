import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// ✅ Load your .env file
dotenv.config();

// ✅ Use correct env variable names from your .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "yourpersonalemail@gmail.com",      // 👈 Replace with your real email
  from: process.env.EMAIL_FROM,           // 👈 must match the one verified in SendGrid
  subject: "Test Email from SendGrid 🚀",
  text: "If you see this, SendGrid is working perfectly!",
};

sgMail
  .send(msg)
  .then(() => console.log("✅ Test email sent successfully!"))
  .catch((err) => {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
  });
