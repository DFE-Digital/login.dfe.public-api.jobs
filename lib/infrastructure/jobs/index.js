class JobsClient {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  async queueNotifyRelyingParty(callback, userId, sourceId) {
    return Promise.resolve();
  }
}

module.exports = JobsClient;
