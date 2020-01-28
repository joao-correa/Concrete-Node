module.exports = require('./repository-connection').creteConenction({
  dburi: process.env.DBURI || 'mongodb+srv://tt:teste@teste-mjdpv.azure.mongodb.net/test?retryWrites=true&w=majority',
});
