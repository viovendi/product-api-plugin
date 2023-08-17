const axios = require('axios');
const { getAccessToken, getUserAgent } = require('../shared/shared');

module.exports = {
  key: "GetAllContactsForOrganization",
  title: "Get all contacts for organization",
  description: "Get all contacts for doo organization.",
  type: "read",
  inputParameters: [
    {
      key: "ClientId",
      title: "Client ID",
      type: "string",
      validation: {
        required: true,
      },
    },
    {
      key: "ClientSecret",
      title: "Client Secret",
      type: "string",
      validation: {
        required: true,
      },
    },
  ],
  operation: {
    type: "js",
    handler,
  },
  outputParameters: [
    {
      key: "ExecutionResult",
      title: "Action execution result",
      type: "string",
      validation: {
        required: true,
      },
    },
  ],
};

async function handler({ inputParameters, configurationParameters, action }) {
  try {
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl);

    const contacts = [];
    let pageNumber = 1;
    let isLastPage = false;
    while (!isLastPage) {
      const result = await axios.get(`${configurationParameters.DooApiUrl}/v1/organizers/current/contacts`, {
        params: {
          sort_order: 'asc',
          sort_by: 'email',
          page_size: '5',
          page: pageNumber,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': configurationParameters.DooApiKey,
          'x-doo-user-agent': getUserAgent(action.key),
        }
      });

      if (result.data.page_count <= pageNumber) {
        isLastPage = true;
      }

      const newContacts = result.data._embedded.organizer_contacts.map(contact => ({
        id: contact.id,
      }));
      contacts.push(...newContacts);
      pageNumber++;
    }

    return {
      ExecutionResult: contacts
    };
  } catch (error) {
    throw new Error(error);
  }
}
