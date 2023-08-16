const axios = require('axios');

module.exports = {
  key: "DeleteContact",
  title: "Delete contact",
  description: "Delete contact form doo contact center",
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

// TODO: add x-doo-user-agent header to all the requests
async function handler({ inputParameters, configurationParameters }) {
  try {
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl);
    
    await axios.delete(`${configurationParameters.DooApiUrl}/v1/organizers/current/contacts/${inputParameters.ContactId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.DooApiKey
      }
    });

    return {
      ExecutionResult: 'success'
    };
  } catch (error) {
    var errorMessage;

    if (error.response) {
      // The request was made and the server responded with a non-2xx status code
      errorMessage = `Error ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from server.";
    } else {
      // An error occurred in setting up the request
      errorMessage = error.message;
    }
    
    throw errorMessage
  }
}

async function getAccessToken(clientId, clientSecret, dooApiUrl, dooApiKey) {
  const response = await axios.post(`${dooApiUrl}/v1/oauth`, {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  },
  {
    headers: {
      'x-api-key': dooApiKey,
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  })

  return response.data.data.access_token;
}
