const Boom = require('boom');
const User = require('../model/User');
const createToken = require('../util/token');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const forgotPasswordSchema = require('../schemas/forgotPassword');
const mail = require('../../../helper/mail');
const password = require('../util/password');

module.exports = {
  method: 'POST',
  path: '/api/users/fogotPassword',
  config: {
    auth: false,
    handler: (req, res) => {
      const email = req.payload.email;
      const newPassword = req.payload.password;

      User.findOne({ email: email }, (err, user) => {
        if (err) throw Boom.badRequest(err);
        if (!user) return res(Boom.notFound('User not found!'));

        password.hashPassword(newPassword, (err, hash) => {
          if (err) throw Boom.badRequest(err);

          user.newPassword = hash;
          const token = createToken(user);
          mail.sentMailForgotPassword(user, token);
          return res({ message: 'Please check your email to confirm new password!' });
        });
      });
    },
    validate: {
      payload: forgotPasswordSchema
    }
  }
};
