const union = require('lodash/union');
const invite = require('./handlers/invite');

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);

  return union(inviteHandlers);
};

module.exports = {
  register,
};
