const rp = require('request-promise');
const jwt = require('jsonwebtoken');

const getToken = (config, clientId) => {
  return jwt.sign({}, config.publicApi.auth.jwtSecret, {
    expiresIn: '10m',
    issuer: 'signin.education.gov.uk'
  });
};

const process = async (config, logger, data) => {
  const { callback, userId, sourceId, state, clientId } = data;
  if (!callback) {
    return logger.info(`publicinvitationnotifyrelyingparty_v1 not called for invited user ${userId} as no callback was supplied`)
  }

  const token = getToken(config, clientId);

  try {
    await rp({
      method: 'POST',
      uri: callback,
      headers: {
        authorization: `bearer ${token}`,
      },
      body: {
        sub: userId,
        sourceId,
        state,
      },
      json: true,
    });
  } catch (e) {
    throw new Error(`Error notifying rp - ${e.message}. (userId: ${userId}, sourceId: ${sourceId}, callback: ${callback})`);
  }
};

const getHandler = (config, logger) => {
  return {
    type: 'publicinvitationnotifyrelyingparty_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
