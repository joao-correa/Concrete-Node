/* eslint-disable prefer-promise-reject-errors */
const Jwt = require('jsonwebtoken');
const Key = require('./../config').key;

exports.Auth = ({ jwt = Jwt, key = Key } = {}) => {
  return {
    autorizar(identificador) {
      const token = jwt.sign(identificador, key, {
        expiresIn: 60 * 30, // 10min
      });
      return token;
    },
    autenticar(token = '') {
      return new Promise(((resolve, reject) => {
        if (!token) {
          return reject({
            code: 401,
            auth: false,
            message: 'Não autorizado',
          });
        }

        return jwt.verify(token, key, (err, decoded) => {
          if (err) {
            return reject({
              code: 401,
              auth: false,
              message: 'Não autorizado',
            });
          }

          return resolve({ code: 200, data: decoded, message: 'autorizado' });
        });
      }));
    },
  }
}  
