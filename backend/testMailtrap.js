import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const client = new MailtrapClient({
  endpoint: "https://send.api.mailtrap.io/",
  token: process.env.MAILTRAP_TOKEN,
});

const sender = { email: "hello@demomailtrap.com", name: "Auth Test" };

async function sendTest() {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email: "gugapriyaa.ntl@gmail.com" }],
      subject: "Mailtrap Test",
      text: "If you see this, your Mailtrap token works ✅",
      category: "Integration Test",
    });
    console.log("✅ Email sent:", response);
  } catch (err) {
    console.error("❌ Mailtrap error:", err.message);
  }
}

sendTest();
