/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const { Server } = require('./app/bin/server');

(async ()=> {
  const server = await Server();
  server.start();
  console.log('server started.');
})();