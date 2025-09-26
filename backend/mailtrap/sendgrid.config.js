import sgMail from '@sendgrid/mail';  

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sender = process.env.EMAIL_FROM;  // match your .env

export { sgMail, sender };
