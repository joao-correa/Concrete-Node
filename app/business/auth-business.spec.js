const { Auth } = require('./auth-business');

describe('assign and validade tokens', () => {

  const auth = Auth({
    jwt : {
      sign: (indetificador, key, options) => {
        return "token";
      },
      verify: (token, key, fn ) => {
        return fn(null, 'teste');
      },
    },
    key : 'teste',
  });

  it('auth - autorizar usuario', () => {
    const token = auth.autorizar('teste');
    expect(token).toBe('token');
  })

  it('auth - autenticar token', async () => {
    const validate = await auth.autenticar('teste');
    expect(validate).toEqual({ code: 200, 
      data: 'teste', 
      message: 'autorizado' 
    });
  });

  it('auth - autenticar sem passa token', async () => {
    let validate = null;
    
    try {
      validate =  await auth.autenticar();
    } catch (error) {
      validate = error;  
    }
    
    expect(validate).toEqual({
      code: 401,
      auth: false,
      message: 'Não autorizado',
    });
  });

  it('auth - validar token nao autorizado', async () => {
    const auth = Auth({
      jwt : {
        sign: (indetificador, key, options) => {
          return "token";
        },
        verify: (token, key, fn ) => {
          return fn({error: true}, 'teste');
        },
      },
      key : 'teste',
    });

    let validate = null;
    try {
      validate =  await auth.autenticar('teste');
    } catch (error) {
      validate = error;  
    }
    expect(validate).toEqual({
      code: 401,
      auth: false,
      message: 'Não autorizado',
    });

  });

});