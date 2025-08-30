const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendContactNotification({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Sip & Chill Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to admin
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactNotification };
