const { getHandler } = require('./../lib/handlers/invite/publicInvitationNotifyRelyingPartyV1');

const config = {
  publicApi: {
    auth: {
      jwtSecret: 'induct-gunk-yaws-preach'
    },
  },
};
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
};

const handler = getHandler(config, logger);
handler.processor(data).then(() => {
  console.info('done');
}).catch((e) => {
  console.error(e.message);
});