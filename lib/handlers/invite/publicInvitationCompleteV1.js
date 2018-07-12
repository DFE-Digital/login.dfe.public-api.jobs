const JobsClient = require('./../../infrastructure/jobs');

const notifyRelyingParties = async (config, data) => {
  const jobs = new JobsClient(config.queueStorage.connectionString);

  for (let i = 0; i < data.callbacks.length; i++) {
    const { callback, sourceId } = data.callbacks[i];
    await jobs.queueNotifyRelyingParty(callback, data.userId, sourceId);
  }
};

const process = async (config, logger, data) => {
  await notifyRelyingParties(config, data)
};

const getHandler = (config, logger) => {
  return {
    type: 'publicinvitationcomplete_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};