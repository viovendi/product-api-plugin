const axios = require('axios');
const { getAccessToken, getUserAgent, getErrorMessage } = require('../shared/shared');
const _ = require('lodash');

const action = {
  key: "SearchContacts",
  title: "Search contacts",
  description: `
    Search contacts in doo organization.
    If no filter is provided, all contacts from the organization will be returned.
  `,
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
    {
      key: "ContactGroupId",
      title: "Contact Group ID",
      description: "Contact Group ID to filter contacts",
      type: "string",
      validation: {
        required: false,
      },
    },
    {
      key: "SearchText",
      title: "Search Text",
      description: "Search text to filter contacts.",
      type: "string",
      validation: {
        required: false,
      },
    },
  ],
  operation: {
    type: "js",
    handler,
  },
  outputParameters: [
    {
      key: "Contacts",
      title: "Contacts",
      description: "Contacts found in the organization matching the search criteria.",
      type: "string",
      validation: {
        required: true,
      },
    },
    {
      key: "NumberOfContacts",
      title: "Number of contacts",
      description: "Number of contacts found in the organization matching the search criteria.",
      type: "string",
      validation: {
        required: true,
      },
    },
  ],
};

async function handler({ inputParameters, configurationParameters, action }) {
  try {
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl, configurationParameters.DooApiKey, action.key);

    const contacts = [];
    let pageNumber = 1;
    let isLastPage = false;
    while (!isLastPage) {
      var params = {
        sort_order: 'asc',
        sort_by: 'email',
        page_size: '50',
        page: pageNumber,
      };

      if (inputParameters.SearchText) {
        params.search_text = inputParameters.SearchText;
      }

      if (inputParameters.ContactGroupId) {
        params.group_id = inputParameters.ContactGroupId;
      }

      const result = await axios.get(`${configurationParameters.DooApiUrl}/v1/organizers/current/contacts`, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': configurationParameters.DooApiKey,
          'x-doo-user-agent': getUserAgent(action.key),
        }
      });

      if (result.data.page_count <= pageNumber) {
        isLastPage = true;
      }

      const newContacts = _.map(result.data._embedded.organizer_contacts, contact => ({ id: contact.id }));
      contacts.push(...newContacts);

      pageNumber++;
    }

    return {
      Contacts: JSON.stringify(contacts), // The output parameter must be a string as Connery only supports string output parameters for now
      NumberOfContacts: contacts.length.toString(), // Becasue of the array is returned as string, and becasue of the limitation of Make, we need this property to get the number of contact groups
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

// Expose internal functions for unit testing in the test environment.
// Otherwise, export the action definition.
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    handler,
  };
} else {
  module.exports = action;
}
