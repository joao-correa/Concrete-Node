const { User } = require('./user-business');

describe('User' , () => {

  const sha1 = sha => sha;

  const userRepository = {
    u: undefined,
    create : async user => { u = user; return { user: [user] }; },
    list: async (where) => {
      return [u]; 
    },
    update: async (identifier, data) => {
      return {...u, ...data};
    },
    exists: async (where) => false,
  };

  const utilities = {
    guid: () => 'teste',
    extractToken: (header) => header.authorization,
  };

  const auth = {
    autorizar : (identificador) => identificador,
    autenticar : token => { return { code: 200, data: token, message: 'autorizado' } }
  };

  it('signup - criar usuario novo', async ( ) => {

    const user = User({
      sha1,
      userRepository,
      auth,
      utilities,
    });

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const criado = await user.signup(usuario);
    usuarioCriado = criado;

    expect(criado.nome).toBeDefined();
    expect(criado.email).toBeDefined();
    expect(criado.senha).toBeDefined();
    expect(criado.telefones).toBeDefined();
    expect(criado.data_criacao).toBeDefined();
    expect(criado.data_atualizacao).toBeDefined();
    expect(criado.ultimo_login).toBeDefined();
    expect(criado.uid).toBeDefined();

  });

  it('signup - email ja existente', async () => {

    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        exists: async (where) => true
      },
      auth,
      utilities,
    });

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };
    
    const criado = await user.signup(usuario);

    expect(criado).toEqual({
      code: 400,
      message: 'E-mail já existente',
    });

  });

  it('signup - erro no create' , async () => {
    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        create : async (user) => {
          throw new Error('teste');
        }
      },
      auth,
      utilities,
    });

    const usuario = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await user.signup(usuario);

    expect( resposta ).toEqual({
      code: 500,
      message: "Internal server error",
    });
  }); 

  it('sigin - logar com sucesso' , async () => {
    const user = User({
      sha1,
      userRepository,
      auth,
      utilities,
    });

    const payload = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'teste',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    };

    const resposta = await user.signin(payload);

    expect(resposta.code).toBe(200);
    expect(resposta.message).toBe('OK');
    expect(resposta.token).toBeDefined();
  });

  it('sigin - logar com credenciais erradas', async () => {
    
    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        list : async (where) => []
      },
      auth,
      utilities,
    });

    const payload = {
      nome: 'joao',
      email: 'jj01@gmail.com',
      senha: 'testeerrado',
      telefones: [{
        ddd: '11',
        numero: '111122222',
      }],
    }; 

    const resposta = await user.signin(payload);

    expect(resposta).toEqual({
      code: 401,
      message: 'Não autorizado',
    });
   
  });

  it('listar - sem token no header', async () => {
    const user = User({
      sha1,
      userRepository,
      auth,
      utilities,
    });

    const headers = {
      authorization: false
    };

    const resposta = await user.listar(headers, { uid : 'teste' });

    expect(resposta.code).toBe(401);
    expect(resposta.message).toBe('Não autorizado');
  });

  it('listar - token do header diferente do token atribuido ao usuario', async () => {

    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        list: async () => {
          return [{
            token: 'tokendiferente',      
            nome: 'joao',
            email: 'jj01@gmail.com',
            senha: 'teste',
            telefones: [{
              ddd: '11',
              numero: '111122222',
            }],
          }]
        }
      },
      auth,
      utilities,
    });

    const headers = {
      authorization: 'teste'
    };

    const resposta = await user.listar(headers, { uid : 'teste' });

    expect(resposta.code).toBe(401);
    expect(resposta.message).toBe('Não autorizado');
  });
  
  it('listar - erro ao tentar autenticar', async () => {
    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        list: async () => {
          return [{
            token: 'token',      
            nome: 'joao',
            email: 'jj01@gmail.com',
            senha: 'teste',
            telefones: [{
              ddd: '11',
              numero: '111122222',
            }],
          }]
        }
      },
      auth : {
        ...auth,
        autenticar : token => { throw new Error('Não autorizado')}
      },
      utilities,
    });

    const headers = {
      authorization: 'token'
    };

    let resposta = null;
    
    try {
      resposta = await user.listar(headers, { uid : 'teste' });
    } catch (error) {
      resposta = error; 
    }

    expect(resposta.code).toBe(401);
    expect(resposta.message).toBe('Não autorizado');
  });

  it('listar - listar com sucesso', async () => {
    const user = User({
      sha1,
      userRepository : {
        ...userRepository,
        list: async () => {
          return [{
            token: 'token',      
            nome: 'joao',
            email: 'jj01@gmail.com',
            senha: 'teste',
            telefones: [{
              ddd: '11',
              numero: '111122222',
            }],
          }]
        }
      },
      auth,
      utilities,
    });

    const headers = {
      authorization: 'token'
    };

    const resposta = await user.listar(headers, { uid : 'teste' });

    expect(resposta.code).toBe(200);
    expect(resposta.message).toBe('OK');
    expect(resposta.token).toBeDefined();
  });

  it('listar - lançando uma exception', async () => {
    const user = User({
      sha1,
      userRepository,
      auth,
      utilities : {
        ...utilities,
        extractToken: () => { throw new Error() }
      },
    });

    let resposta

    try {
      resposta =  await user.listar({}, {});
    } catch (error) {
      resposta = error;
    }
    
    expect(resposta.code).toBe(500);
    expect(resposta.message).toBe('Internal server error');
  });

  it('listar - lançando uma custom exception ', async () => {
    const user = User({
      sha1,
      userRepository,
      auth,
      utilities : {
        ...utilities,
        extractToken: () => { throw new Error("teste") }
      },
    });

    let resposta

    try {
      resposta =  await user.listar({}, {});
    } catch (error) {
      resposta = error;
    }
    
    expect(resposta.code).toBe(500);
    expect(resposta.message).toBe('teste');
  });
});