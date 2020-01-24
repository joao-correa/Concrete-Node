/* eslint-disable linebreak-style */
/* eslint-disable no-console */

const hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const routes = require('./app/router/index.js');

const init = async () => {
  const server = hapi.server({
    port: process.env.MODE === 'production' ? (process.env.PORT || 80) : 3000,
    host: process.env.MODE === 'production' ? '0.0.0.0' : 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'Concrete - Node.js Challange',
      version: '1.0.0',
    },
  };

  await server.register([Inert, Vision, {
    plugin: HapiSwagger,
    options: swaggerOptions,
  }]);

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(JSON.stringify(err));
  process.exit(1);
});

init();
