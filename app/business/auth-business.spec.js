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

  it('assigment token success', () => {
    const token = auth.autorizar('teste');
    expect(token).toBe('token');
  })

  it('validate token success', async () => {
    const validate = await auth.autenticar('teste');
    expect(validate).toEqual({ code: 200, 
      data: 'teste', 
      message: 'autorizado' 
    });
  });

  it('validate token error - without token parameter', async () => {
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

  it('validate token error - not authorized', async () => {
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