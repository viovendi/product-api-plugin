const axios = require('axios');

async function getAccessToken(clientId, clientSecret, dooApiUrl, dooApiKey, actionKey) {
    const response = await axios.post(`${dooApiUrl}/v1/oauth`, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    },
        {
            headers: {
                'x-api-key': dooApiKey,
                'x-doo-user-agent': getUserAgent(actionKey),
            }
        })

    return response.data.data.access_token;
}

async function getInfoAboutCurrentOrganization(accessToken, dooApiUrl, dooApiKey, actionKey) {
    const requestOptions = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': dooApiKey,
          'x-doo-user-agent': getUserAgent(actionKey),
        }
      };

    const response = await axios.get(`${dooApiUrl}/v1/organizers/current/organizations`, requestOptions);

    return {
        organizationId: response.data.active_team.organization_id,
        teamId: response.data.active_team.id
    }
}

function getUserAgent(actionKey) {
    return {
        userAgent: 'connery',
        connery: {
            connector: 'viovendi/doo-product-automations',
            action: actionKey,
        }
    }
}

function getErrorMessage(error) {
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

    return errorMessage;
}

module.exports = {
    getAccessToken,
    getInfoAboutCurrentOrganization,
    getUserAgent,
    getErrorMessage
}