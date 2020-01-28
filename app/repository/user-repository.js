const Repository = require('./index');
const Config = require('./../config');

exports.User = ({ repository = Repository, config = Config } = {}) => {
  return {
    async create(payload) {
      const db = await repository.getDb(config.dbname);
      const user = await db.collection(config.mongoCollections.user).insertOne(payload);
      return { user: user.ops, result: user.result };
    },
    async list(where) {
      const db = await repository.getDb(config.dbname);
      const result = await db.collection(config.mongoCollections.user).find(where);
      return result.toArray();
    },
    async update(identifier, data) {
      const db = await repository.getDb(config.dbname);
      const updated = await db.collection(config.mongoCollections.user).findOneAndUpdate(identifier, { $set: data });
      return updated;
    },
    async exists(where) {
      const usuarioExiste = await this.list(where);

      if (usuarioExiste && usuarioExiste.length > 0)
        return true;

      return false;
    }
  }
};
