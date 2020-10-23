const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b17cc83147583a",
      pass: "98da72758a0faf"
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Hrach Galstyan',
    to: 'hrachgalstyann@gmail.com',
    subject: 'Test',
    text: 'Test',
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

sendEmail();

module.exports = sendEmail;
