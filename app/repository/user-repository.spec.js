const {User} = require('./user-repository');
const config = require('./../config');

describe('User repository' , () => {

  const repositoryConnection  = {
    async getDb(){
      return {
        collection(collectionName){
          return {
            insertOne(payload){
              return {
                ops : [payload],
                result : true,
              }
            },
            find(where){
              return {
                toArray() {
                  return [
                    where
                  ]
                }
              }
            }, 
            findOneAndUpdate(indetifier, data ){
              return data;
            }
          }
        }
      }
    }
  }

  it('create - sucesso' , async () => {
    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await repo.create(usuario);

    expect(resposta.user).toBeDefined();
    expect(resposta.result).toBeDefined();
  });

  it('list - sucesso' , async () => {
    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await repo.list(usuario);

    expect(resposta[0]).toEqual(usuario);
  });

  it('update - sucesso' , async () => {

    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await repo.update({ uid : 1 }, usuario);

    expect(resposta).toBeDefined();
  });

  it('exists - true' , async () => {
    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await repo.exists(usuario);

    expect(resposta).toBeTruthy();
  });

  it('exists - true' , async () => {
    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await repo.exists(usuario);

    expect(resposta).toBeTruthy();
  });

  it('exists - false' , async () => {
    const repositoryConnection  = {
      async getDb(){
        return {
          collection(collectionName){
            return {
              find(where){
                return {
                  toArray() {
                    return []
                  }
                }
              }
            }
          }
        }
      }
    }

    const repo = User({repository: repositoryConnection});

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    let resposta = await repo.exists(usuario);

    console.log('----------------------------->' , resposta );
    
    expect(resposta).toBeFalsy()
  });

});