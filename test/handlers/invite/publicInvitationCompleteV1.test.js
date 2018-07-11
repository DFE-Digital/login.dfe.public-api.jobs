jest.mock('./../../../lib/infrastructure/jobs');


const jobs = {
  queueNotifyRelyingParty: jest.fn(),
};
const JobsClient = require('./../../../lib/infrastructure/jobs');

const { getHandler } = require('./../../../lib/handlers/invite/publicInvitationCompleteV1');

const config = {
  queueStorage: {
    connectionString: '',
  },
  publicApi: {
    directories: {},
    organisations: {},
  }
};
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


describe('when handling a invitation complete (v1)', () => {
  let handler;
  let data;

  beforeEach(() => {
    data = {
      id: 'invite1',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@unit.tests',
      origin: {
        clientId: 'clientone',
        redirectUrl: 'http://source/reg/complete',
      },
      selfStarted: false,
      callbacks: [
        {
          sourceId: 'firstuser',
          callback: 'http://source/callback'
        },
        {
          sourceId: 'abc123',
          callback: 'http://source2/users'
        }
      ],
      userId: 'user-1',
    };

    jobs.queueNotifyRelyingParty.mockReset();
    JobsClient.mockReset().mockImplementation(() => {
      return jobs;
    });

    handler = getHandler(config, logger);
  });

  it('then it should queue a notify relying party job for each callback', async () => {
    await handler.processor(data);

    expect(jobs.queueNotifyRelyingParty).toHaveBeenCalledTimes(2);
    expect(jobs.queueNotifyRelyingParty).toHaveBeenCalledWith(data.callbacks[0].callback, data.userId, data.callbacks[0].sourceId);
    expect(jobs.queueNotifyRelyingParty).toHaveBeenCalledWith(data.callbacks[1].callback, data.userId, data.callbacks[1].sourceId);
  });
});
