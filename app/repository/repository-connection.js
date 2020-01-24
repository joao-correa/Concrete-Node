const Mongo = require('mongodb').MongoClient;
const config = require('./../config');

module.exports = {
  getConnection: (() => {
    let conn = null;

    return () => new Promise(((resolve, reject) => {
      if (conn) {
        return resolve(conn);
      }

      const client = new Mongo(config.mongo.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return client.connect((err) => {
        if (err) {
          return reject(err);
        }

        conn = client.db('concrete');
        return resolve(conn);
      });
    }));
  })(),
};
