/* eslint-disable no-undef */
const { creteConenction } = require('./repository-connection');

describe('createConencton', () => {
  const fakeMongoDbConnection = {
    db: jest.fn(),
  };

  const fakeMongoDbClient = {
    connect: jest.fn().mockImplementation(() => Promise.resolve(fakeMongoDbConnection)),
  };

  it('shoud connect on the fist time when getDb is called', async () => {
    const connector = creteConenction({
      dburi: 'mongodb://blablabla',
      client: fakeMongoDbClient,
    });

    await connector.getDb('test');
    await connector.getDb('test');
    expect(fakeMongoDbClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should get db by internal connection', async () => {
    const connector = creteConenction({
      dburi: 'mongodb://blablabla',
      client: fakeMongoDbClient,
    });

    await connector.getDb('testdb');
    expect(fakeMongoDbConnection.db).toHaveBeenCalledWith('testdb');
  });
});
