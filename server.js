const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const config = require('config');

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: config.get('server.port'), routes: { cors: true } });

server.register(require('hapi-auth-jwt'), (err) => {
  // We are giving the strategy a name of 'jwt'
  server.auth.strategy('jwt', 'jwt', 'required', {
    key: config.get('secretkey'),
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('api/**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

// Start the server
server.start(err => {
  if (err) throw err;
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(config.get('db.url'), {}, (err) => {
    if (err) throw err;
  });
});
