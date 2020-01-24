const Joi = require('@hapi/joi');

module.exports = {
  signup: Joi.object({
    nome: Joi.string().required().description('Nome do usuário.'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().description('Email do usuário.'),
    senha: Joi.string().required().description('Senha do usuário'),
    telefones: Joi.array().items(Joi.object({
      numero: Joi.string().pattern(/[0-9]{4,5}-?[0-9]{4}/).required().description('Telefone do usuário'),
      ddd: Joi.string().pattern(/[0-9]{2}/).required().description('DDD do telefone do usuário.'),
    })).required().description('Informações de contato do usuário.'),
  }),
  signin: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().description('Email do usuário'),
    senha: Joi.string().required().description('Senha do usuário.'),
  }),
};
