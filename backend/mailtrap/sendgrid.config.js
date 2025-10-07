import sgMail from "@sendgrid/mail";

// ✅ Do NOT call dotenv.config() here.
// (Your index.js already loads .env at the very beginning)

// ✅ Validate environment variables safely
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing. Check your .env file.");
} else if (!process.env.SENDGRID_API_KEY.startsWith("SG.")) {
  console.error("❌ API key does not start with 'SG.'");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("📨 SendGrid API key configured successfully ✅");
}

if (!process.env.EMAIL_FROM) {
  console.error("❌ EMAIL_FROM is missing. Check your .env file.");
} else {
  console.log("📧 EMAIL_FROM loaded:", process.env.EMAIL_FROM);
}

// ✅ Export for use in other files
const sender = process.env.EMAIL_FROM;
export { sgMail, sender };
