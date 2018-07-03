const process = async (config, logger, data) => {

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