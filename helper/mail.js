const nodemailer = require("nodemailer");
const config = require("config");

const smtpTransport = nodemailer.createTransport({
  host: config.get('smtp.host'),
  port: config.get('smtp.port'),
  secure: config.get('smtp.ssl'),
  auth: {
    user: config.get('smtpUserName'),
    pass: config.get('smtpPassword'),
  }
});

const mail = ({ to, subject, mailbody }) => {
  const from = `${config.get('app')} Team ${config.get('smtpUserName')}`;
  const html = mailbody;

  smtpTransport.sendMail({ from, to, subject, html },
    (error, response) => {
      if (error) console.error(error);
      smtpTransport.close();
    })
};

const sentMailVerificationLink = (user, token) => {
  mail({
    mailbody: `<p>Thanks for Registering on ${config.get('app')}</p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://${config.get('server.host')}:${config.get('server.port')}/api/users/verifyEmail/${token}'>Verification Link</a></p>`,
    to: user.email,
    subject: 'Account Verification'
  });
};

const sentMailForgotPassword = (user, token) => {
  mail({
    mailbody: `<p>Your ${config.get('app')} Account Credential</p><p>username :${user.username}, password : ******</p>
    <p>Please verify your new password by clicking on the verification link below.<br/><a href='http://${config.get('server.host')}:${config.get('server.port')}/api/users/verifyPassword/${token}'>Verification Link</a></p>`,
    to: user.email,
    subject: 'Account password'
  });
};

module.exports = {
  sentMailVerificationLink,
  sentMailForgotPassword
};
