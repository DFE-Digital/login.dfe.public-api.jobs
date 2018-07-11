const ApiClient = require('./../ApiClient');

class OrganisationsClient extends ApiClient {
  constructor(opts, correlationId) {
    super(opts, correlationId);
  }

  async addOrganisationToInvitation(invitationId, organisationId, roleId) {
    return this._callApi(`/organisations/${organisationId}/invitations/${invitationId}`, 'PUT', { roleId });
  }

  async addOrganisationToUser(userId, organisationId, roleId) {
    return Promise.resolve();
  }
}

module.exports = OrganisationsClient;
