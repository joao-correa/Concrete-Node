const repository = require('./repository-connection');
const config = require('./../config');

module.exports = {
  async create(payload) {
    const conn = await repository.getConnection();
    const user = await conn.collection(config.mongoCollections.user).insertOne(payload);
    return { user: user.ops, result: user.result };
  },
  async list(where = {}) {
    const conn = await repository.getConnection();
    const result = await conn.collection(config.mongoCollections.user).find(where);
    return result.toArray();
  },
  async update(identifier = {}, data = {}) {
    const conn = await repository.getConnection();
    const updated = await conn.collection(config.mongoCollections.user)
      .findOneAndUpdate(identifier, { $set: data });
    return updated;
  },
};
