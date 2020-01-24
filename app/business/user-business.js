/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable-next-line no-else-return */
const sha1 = require('sha1');
const userRepository = require('./../repository/user-repository');
const utilities = require('./../utilities');
const auth = require('./auth-business');

class User {
  static async create(payload = {}) {
    let payloadClone = { ...payload };

    let usuarioExiste = null;
    let usuario = null;
    let token = null;

    usuarioExiste = await User.exists({ email: payloadClone.email });

    if (usuarioExiste) {
      return {
        code: 400,
        message: 'E-mail já existente',
      };
    }

    token = auth.autorizar({ uid: payloadClone.uid });

    payloadClone = {
      ...payloadClone,
      data_atualizacao: new Date(),
      data_criacao: new Date(),
      ultimo_login: new Date(),
      uid: utilities.guid(),
      senha: sha1(payloadClone.senha),
      token: sha1(token),
    };

    try {
      usuario = await userRepository.create(payloadClone);
    } catch (error) {
      return {
        code: (error && error.code) || 500,
        message: (error && error.message) || 'Internal server error',
      };
    }

    return {
      code: 201,
      message: 'OK',
      ...usuario.user[0],
      token,
    };
  }

  static async listar(headers, uid) {
    try {
      const token = utilities.extractToken(headers);

      if (!token) {
        return {
          code: 401,
          message: 'Não autorizado',
        };
      }

      let repositoryResult = null;
      let resultado = null;

      repositoryResult = await userRepository.list({ uid });

      // eslint-disable-next-line max-len
      if (repositoryResult && repositoryResult.length > 0 && repositoryResult[0].token !== sha1(token)) {
        return {
          code: 401,
          message: 'Não autorizado',
        };
      }

      try {
        await auth.autenticar(token);
      } catch (error) {
        return {
          code: 401,
          message: (error && error.message) || 'Não autorizado',
        };
      }

      repositoryResult[0].token = token;

      resultado = {
        code: 200,
        message: 'OK',
        ...repositoryResult[0],
      };

      return resultado;
    } catch (error) {
      return {
        code: 500,
        message: (error && error.message) || 'Internal server error',
      };
    }
  }

  static async autenticar(u = {}) {
    const user = { ...u, senha: sha1(u.senha) };
    const usuario = await userRepository.list(user);

    if (usuario && usuario.length === 0) {
      return {
        code: 401,
        message: 'Não autorizado',
      };
    }

    const token = auth.autorizar({ uid: usuario[0].uid });
    const retorno = {
      ...usuario[0],
      token,
    };

    await userRepository.update({ uid: usuario[0].uid }, {
      token: sha1(token),
      data_atulizacao: new Date(),
      ultimo_login: new Date(),
    });

    return {
      code: 200,
      message: 'OK',
      ...retorno,
    };
  }

  static async exists(where = {}) {
    const usuarioExiste = await userRepository.list(where);

    if (usuarioExiste && usuarioExiste.length > 0)
      return true;

    return false;
  }
}

module.exports = {
  async signup(payload = {}) {
    const retorno = await User.create(payload);
    return retorno;
  },
  async signin(payload = {}) {
    const retorno = await User.autenticar(payload);
    return retorno;
  },
  async listar(header, uid) {
    const retorno = await User.listar(header, uid);
    return retorno;
  },
};
