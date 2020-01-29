require('dotenv').config();

module.exports = require('./repository-connection').creteConenction({
  dburi: process.env.DBURI,
});
