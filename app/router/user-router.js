const JOI = require('@hapi/joi');
const RequestContractor = require('./../contractor/request-contractor');
const ResponseContractor = require('./../contractor/response-contractor');
const { User } = require('./../business/user-business');

exports.UserRouter = ({ responseContractor = ResponseContractor, requestContractor = RequestContractor, Joi = JOI } = {}) => {
  return [
    {
      method: 'GET',
      path: '/user/{uid}',
      options: {
        handler: async (request, h) => {
          const user = User();
          const { uid } = request.params;
          const resultado = await user.listar(request.headers, uid);
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
            authorization: Joi.string().pattern(/Bearer .*/),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    },
  ]
};
