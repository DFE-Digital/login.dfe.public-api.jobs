const { getHandler } = require('./../lib/handlers/invite/publicInvitationRequestV1');
const config = require('./config');

const logger = {
  info: (message, meta) => {
    console.info(`INF: ${message} {${JSON.stringify(meta)}`);
  },
  warn: (message, meta) => {
    console.warn(`WAR: ${message} {${JSON.stringify(meta)}`);
  },
  error: (message, meta) => {
    console.error(`ERR: ${message} {${JSON.stringify(meta)}`);
  },
};
const data = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@local.test',
  organisation: 'fa460f7c-8ab9-4cee-aaff-82d6d341d702',
  sourceId: 'testuser1',
  callback: 'http://localhost:3000/user/testuser1/registationcomplete',
  userRedirect: 'http://localhost:3000/login',
  clientId: 'test'
};

const handler = getHandler(config, logger);
handler.processor(data).then(() => {
  console.info('done');
}).catch((e) => {
  console.error(e.message);
});