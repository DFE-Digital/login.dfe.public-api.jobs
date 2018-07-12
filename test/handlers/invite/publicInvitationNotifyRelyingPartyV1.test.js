jest.mock('request-promise');
jest.mock('jsonwebtoken');

const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const { getHandler } = require('./../../../lib/handlers/invite/publicInvitationNotifyRelyingPartyV1');

const config = {
  queueStorage: {
    connectionString: '',
  },
  publicApi: {
    directories: {},
    organisations: {},
    auth: {
      jwtSecret: 'some-super-secure-secret',
    },
  },
};
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


describe('when handling a notify relying party (v1)', () => {
  let handler;
  let data;

  beforeEach(() => {
    data = {
      userId: 'user-1',
      sourceId: 'firstuser',
      callback: 'http://source/callback',
    };

    jwt.sign.mockReturnValue('json-web-token');

    handler = getHandler(config, logger);
  });

  it('then it should post a request to the callback', async () => {
    await handler.processor(data);

    expect(rp).toHaveBeenCalledTimes(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      uri: data.callback,
    });
  });

  it('then it should authorize the call to the callback with a jwt', async () => {
    await handler.processor(data);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith({}, config.publicApi.auth.jwtSecret, {
      expiresIn: '10m',
      issuer: 'signin.education.gov.uk'
    });
    expect(rp.mock.calls[0][0]).toMatchObject({
      headers: {
        authorization: 'bearer json-web-token',
      },
    });
  });

  it('then it should send the users id and source id in body', async () => {
    await handler.processor(data);

    expect(rp.mock.calls[0][0]).toMatchObject({
      body: {
        sub: data.userId,
        sourceId: data.sourceId,
      },
      json: true,
    });
  });
});
