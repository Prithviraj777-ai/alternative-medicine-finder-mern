const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer.
 * Configured via SMTP environment variables.
 *
 * @param {Object} options - { email, subject, message (HTML body) }
 */
const sendEmail = async (options) => {
  // Create transporter with SMTP credentials from env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define mail options
  const mailOptions = {
    from: `"MedMatch" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
