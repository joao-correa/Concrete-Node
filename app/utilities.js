module.exports = {
  guid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ Math.floor((Math.random() * 255)) & 15 >> c / 4).toString(16)); // eslint-disable-line no-bitwise, no-mixed-operators
  },
  extractToken(headers = {}) {
    return headers && headers.authorization && headers.authorization.replace(/Bearer {(.*)}/g, '$1');
  },
};
