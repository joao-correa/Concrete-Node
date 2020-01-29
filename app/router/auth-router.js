const RequestContractor = require('./../contractor/request-contractor');
const ResponseContractor = require('./../contractor/response-contractor');
const { User } = require('./../business/user-business');

exports.AuthRouter = ({ responseContractor = ResponseContractor, requestContractor = RequestContractor } = {}) => {
  return [{
    method: 'POST',
    path: '/signup',
    options: {
      tags: ['api'],
      description: 'Criar um novo usuário.',
      notes: 'Recebe um usuário como payload, e o retorna com id e token de acesso.',
      handler: async (request, h) => {
        const user = User();
        const resultado = await user.signup(request && request.payload);
        return h.response(resultado).code(resultado.code);
      },
      response: {
        status: {
          201: responseContractor.signup.success,
          400: responseContractor.signup.badRequest,
          500: responseContractor.signup.internalServerError,
        },
        options: {
          stripUnknown: true,
        },
      },
      validate: {
        payload: requestContractor.signup,
      },
    },
  },
  {
    method: 'POST',
    path: '/signin',
    options: {
      handler: async (request, h) => {
        const user = User();
        const retorno = await user.signin(request.payload);
        return h.response(retorno).code(retorno.code);
      },
      tags: ['api'],
      description: 'Autenticar o usuário por email e senha.',
      notes: 'Autenticar o usuário e retornar um token.',
      response: {
        status: {
          200: responseContractor.signin.authorized,
          400: responseContractor.signin.badRequest,
          500: responseContractor.signin.internalServerError,
          401: responseContractor.signin.unauthorized,
        },
        options: {
          stripUnknown: true,
        },
      },
      validate: {
        payload: requestContractor.signin,
      },
    },
  }]
};
