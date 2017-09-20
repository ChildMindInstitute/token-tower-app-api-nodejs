const Boom = require('boom');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const config = require('config');

module.exports = {
  method: 'GET',
  path: '/api/users/verifyEmail/{token}',
  config: {
    auth: false,
    handler: (request, reply) => {
      jwt.verify(request.params.token, config.get('secretkey'), (err, decoded) => {
        if (decoded === undefined) return reply(Boom.forbidden("invalid verification link"));

        User.findOne({ _id: decoded.id }, (err, user) => {
          if (err) {
            console.error(err);
            return reply(Boom.badImplementation(err));
          }
          if (user === null) return reply(Boom.forbidden("invalid verification link"));
          if (user.isVerified === true) return reply(Boom.forbidden("account is already verified"));
          user.isVerified = true;
          User.findOneAndUpdate({ _id: decoded.id }, user, (err, user) => {
            if (err) {
              console.error(err);
              return reply(Boom.badImplementation(err));
            }
            return reply("account sucessfully verified");
          })
        })
      });
    }
  }
};
