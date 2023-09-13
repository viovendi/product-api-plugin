const axios = require('axios');
const { getAccessToken, getUserAgent, getErrorMessage } = require('../shared/shared');

const action = {
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
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl, configurationParameters.DooApiKey, action.key);

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
