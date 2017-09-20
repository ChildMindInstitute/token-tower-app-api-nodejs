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

exports.sentMailVerificationLink = (user, token) => {
  mail({
    mailbody: `<p>Thanks for Registering on ${config.get('app')}</p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://${config.get('server.host')}:${config.get('server.port')}/${token}'>Verification Link</a></p>`,
    to: user.email,
    subject: 'Account Verification'
  });
};

exports.sentMailForgotPassword = (user) => {
  mail({
    mailbody: `<p>Your ${config.get('app')} Account Credential</p><p>username :${user.email}, password : ${user.password}</p>`,
    to: user.email,
    subject: 'Account password'
  });
};
