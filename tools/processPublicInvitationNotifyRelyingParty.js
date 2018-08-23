const { getHandler } = require('./../lib/handlers/invite/publicInvitationNotifyRelyingPartyV1');
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
  userId: 'user-one',
  sourceId: 'first-user',
  callback: 'http://localhost:3000/users/registered',
  state: 'EXISTING_USER',
};

const handler = getHandler(config, logger);
handler.processor(data).then(() => {
  console.info('done');
}).catch((e) => {
  console.error(e.message);
});
