import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Şifre Sıfırlama Talebi',
    html: `<p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };
  return transporter.sendMail(mailOptions);
};

export default transporter;
