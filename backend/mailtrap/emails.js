import { sgMail } from "./sendgrid.config.js";

// Always use the same verified sender
const sender = process.env.EMAIL_FROM;

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const msg = {
      to: email,
      from: sender,
      subject: "Verify your email",
      html: `<p>Your verification code is <b>${verificationToken}</b></p>`,
    };
    await sgMail.send(msg);
    console.log("✅ Verification email sent");
  } catch (error) {
    console.error("❌ Error sending verification email:", error.response?.body || error.message);
    throw new Error("Error sending verification email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const msg = {
      to: email,
      from: sender,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`,
    };
    await sgMail.send(msg);
    console.log("✅ Password reset email sent");
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.response?.body || error.message);
    throw new Error("Error sending password reset email");
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const msg = {
      to: email,
      from: sender,
      subject: "Password Reset Successful",
      html: `<p>Your password has been successfully reset. If this wasn’t you, please secure your account immediately.</p>`,
    };
    await sgMail.send(msg);
    console.log("✅ Password reset success email sent");
  } catch (error) {
    console.error("❌ Error sending reset success email:", error.response?.body || error.message);
    throw new Error("Error sending reset success email");
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const msg = {
      to: email,
      from: sender,
      subject: "Welcome to Auth Company 🎉",
      html: `<h2>Hello ${name},</h2>
             <p>Welcome to <b>Auth Company</b>! We're excited to have you onboard 🚀</p>
             <p>If you have any questions, feel free to reply to this email.</p>`,
    };
    await sgMail.send(msg);
    console.log("✅ Welcome email sent");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.response?.body || error.message);
    throw new Error("Error sending welcome email");
  }
};
