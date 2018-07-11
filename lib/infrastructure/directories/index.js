const ApiClient = require('./../ApiClient');

class DirectoriesClient extends ApiClient {
  constructor(opts, correlationId) {
    super(opts, correlationId);
  }

  async getUserByEmail(email) {
    return this._callApi(`/users/${email}`);
  }

  async getInvitationByEmail(email) {
    return this._callApi(`/invitations/by-email/${email}`);
  }

  async createInvitation(invitation) {
    return Promise.resolve('some-id');
  }

  async updateInvitation(invitation) {
    return Promise.resolve();
  }
}

module.exports = DirectoriesClient;
