const Joi = require('@hapi/joi');

const deafultContractor = Joi.object({
  message: Joi.string().required().description('Return message of the request').description('the request return message'),
  nome: Joi.string().required().description("The user's name"),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().description("The user's email"),
  senha: Joi.string().required().description("The user`s password'"),
  telefones: Joi.array().items(Joi.object({
    numero: Joi.string().pattern(/[0-9]{4,5}-?[0-9]{4}/).required().description("The number of the user's phon"),
    ddd: Joi.string().pattern(/[0-9]{2}/).required().description("DDD of the user's phone"),
  })).required().description('The contact info of the user'),
  data_criacao: Joi.date().required().description('The created date of the user'),
  data_atualizacao: Joi.date().required().description('The last update date'),
  ultimo_login: Joi.date().required().description('The last login date'),
  uid: Joi.string().required().description('User unique indentifier'),
  token: Joi.string().required().description('Auth generated token'),
});

const badRequest = Joi.object({
  message: Joi.string().required().description('Return message of the request'),
});

const internalServerError = Joi.object({
  message: Joi.string().required().description('Return message of the request'),
});

const unauthorized = Joi.object({
  message: Joi.string().required().description('Return message of the request'),
});

module.exports = {
  signup: {
    success: deafultContractor,
    badRequest,
    internalServerError,
  },
  signin: {
    badRequest,
    internalServerError,
    unauthorized,
    authorized: deafultContractor,
  },
  user: {
    badRequest,
    internalServerError,
    success: deafultContractor,
    unauthorized,
  },
};
