const ApiClient = require('./../ApiClient');

class OrganisationsClient extends ApiClient {
  constructor(opts, correlationId) {
    super(opts, correlationId);
  }

  async addOrganisationToInvitation(invitationId, organisationId, roleId) {
    return this._callApi(`/organisations/${organisationId}/invitations/${invitationId}`, 'PUT', { roleId });
  }

  async addOrganisationToUser(userId, organisationId, roleId) {
    return this._callApi(`/organisations/${organisationId}/users/${userId}`, 'PUT', { roleId });
  }
}

module.exports = OrganisationsClient;
