const { guid, extractToken } = require('./utilities');

describe('utilities', () => {
  
  const header = {
    authorization: 'Bearer TEST.TESTTEST.TEST',
  }

  it('guid - return a uid every call.', () => {
    const g = guid();
    expect(g).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
  });

  it('extractToken - return a token within the header of the request' , () => {
    const token = extractToken(header);
    expect(token).toBe('TEST.TESTTEST.TEST');
  });

});
