const axios = require('axios');
const { getAccessToken, getUserAgent } = require('../shared/shared');

module.exports = {
  key: "DeleteContact",
  title: "Delete contact",
  description: "Delete contact from doo organization.",
  type: "delete",
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
      key: "ContactId",
      title: "Contact ID",
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

    await axios.delete(`${configurationParameters.DooApiUrl}/v1/organizers/current/contacts/${inputParameters.ContactId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.DooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      }
    });

    return {
      ExecutionResult: 'success'
    };
  } catch (error) {
    var errorMessage;

    // TODO: cover error handling with unit tests
    if (error.response) {
      if (error.response.data?.user_message.includes('Contact is not eligible for deletion'))
        // Enrich error message with more details
        errorMessage = `Error ${error.response.status}: Contact is not eligible for deletion. There is at least one active or unapproved booking for a running event for this contact. Therefore the personal data of this contact cannot be deleted. Please cancel or reject the respective booking(s) before deleting the contact.`;
      else {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.user_message || error.response.data?.developer_message || error.response.statusText}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from server.";
    } else {
      // An error occurred in setting up the request
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}
