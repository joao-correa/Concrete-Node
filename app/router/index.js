const Joi = require('@hapi/joi');
const userBusiness = require('./../business/user-business');

const responseContractor = require('./../contractor/response-contractor');
const requestContractor = require('./../contractor/request-contractor');

const defaultRouter = [
  {
    method: ['*'],
    path: '/{any*}',
    options: {
      tags: ['api'],
      description: 'End-point Not found',
      notes: 'Catch all endpoint that no match before',
      handler: (request, h) => h.response({
        message: 'Endpoint não encontrado',
      }).code(404),
    },
  },
];

const applicationRouter = [
  {
    method: 'POST',
    path: '/signup',
    options: {
      tags: ['api'],
      description: 'Criar um novo usuário.',
      notes: 'Recebe um usuário como payload, e o retorna com id e token de acesso.',
      handler: async (request, h) => {
        const resultado = await userBusiness.signup(request && request.payload);
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
        const retorno = await userBusiness.signin(request.payload);
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
  },
  {
    method: 'GET',
    path: '/user/{uid}',
    options: {
      handler: async (request, h) => {
        const { uid } = request.params;
        const resultado = await userBusiness.listar(request.headers, uid);
        return h.response(resultado).code(resultado.code);
      },
      tags: ['api'],
      description: 'Obter o usuário logado',
      notes: 'Retornar o usuário por uid',
      response: {
        status: {
          200: responseContractor.user.success,
          400: responseContractor.user.badRequest,
          401: responseContractor.user.unauthorized,
          500: responseContractor.user.internalServerError,
        },
        options: {
          stripUnknown: true,
        },
      },
      validate: {
        params: Joi.object({
          uid: Joi.string().required(),
        }),
        headers: Joi.object({
          authentication: Joi.string().pattern(/Bearer {.*}/),
        }),
        options: {
          allowUnknown: true,
        },
      },
    },
  },
];

module.exports = [
  ...applicationRouter,
  ...defaultRouter,
];
