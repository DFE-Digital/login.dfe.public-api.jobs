jest.mock('./../../../lib/infrastructure/applications');
jest.mock('request-promise');
jest.mock('jsonwebtoken');

const applications = {
  getApplication: jest.fn(),
};
const ApplicationsClient = require('./../../../lib/infrastructure/applications');

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
    applications: {},
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

    applications.getApplication.mockReset();
    ApplicationsClient.mockReset().mockImplementation(() => {
      return applications;
    });

    handler = getHandler(config, logger);
  });

  it('then it should not attempt to send a callback if its not present in the payload', async () => {
    data.callback = undefined;
    await handler.processor(data);

    expect(rp).toHaveBeenCalledTimes(0);

  });

  it('then it should post a request to the callback', async () => {
    await handler.processor(data);

    expect(rp).toHaveBeenCalledTimes(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      uri: data.callback,
    });
  });

  it('then it should authorize the call to the callback with a jwt signed using general secret if callback does not have clientid', async () => {
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

  it('then it should authorize the call to the callback with a jwt signed using client api secret if callback has clientid', async () => {
    const apiSecret = 'client_api_secret';
    applications.getApplication.mockReturnValue({
      relyingParty: {
        api_secret: apiSecret,
      },
    });
    data.clientId = 'clientone';

    await handler.processor(data);

    expect(applications.getApplication).toHaveBeenCalledTimes(1);
    expect(applications.getApplication).toHaveBeenCalledWith(data.clientId);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith({}, apiSecret, {
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
