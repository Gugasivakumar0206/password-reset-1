import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "yourpersonalemail@gmail.com",  // 👈 where you want to receive the test
  from: process.env.SENDER_EMAIL,     // 👈 must match verified sender/domain
  subject: "Test Email from SendGrid",
  text: "If you see this, SendGrid works!",
};

sgMail
  .send(msg)
  .then(() => console.log("✅ Test email sent successfully"))
  .catch((err) => {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
  });
