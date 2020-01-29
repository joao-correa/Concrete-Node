const { UserRouter } = require('./user-router');
const { AuthRouter } = require('./auth-router');
const { DefaultRouter } = require('./default-router');

module.exports = [
  ...DefaultRouter(),
  ...UserRouter(),
  ...AuthRouter(),
];
