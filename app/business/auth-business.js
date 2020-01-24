/* eslint-disable prefer-promise-reject-errors */
const jwt = require('jsonwebtoken');
const { key } = require('./../config');

module.exports = {
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
};
