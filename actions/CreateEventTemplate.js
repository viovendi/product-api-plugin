const axios = require('axios');
const { getAccessToken, getUserAgent, getErrorMessage, getInfoAboutCurrentOrganization } = require('../shared/shared');

const action = {
  key: "CreateEventTemplate",
  title: "Create event template",
  description: "Create a new event template based on a draft event and an event guide.",
  type: "create",
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
      key: "DraftEventId",
      title: "Draft event ID",
      type: "string",
      validation: {
        required: true,
      },
    },
    {
      key: "EventGuideTemplate",
      title: "Event guide template",
      description: "Event guide template in JSON string format according to the specification.",
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
  outputParameters: [],
};

async function handler({ inputParameters, configurationParameters, action }) {
  try {
    const sharedRequestOptions = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.DooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      }
    };

    // Get access token
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl, configurationParameters.DooApiKey, action.key);

    // Get current OID
    const currentOid = await getInfoAboutCurrentOrganization(accessToken, configurationParameters.DooApiUrl, configurationParameters.DooApiKey, action.key);

    // Create event guide
    const eventGuideTemplate = JSON.parse(inputParameters.EventGuideTemplate);
    await axios.post(`${configurationParameters.DooApiUrl}/v1/organizers/${currentOid.organizationId}/event_guides`, eventGuideTemplate, sharedRequestOptions);

    // Get event guide ID as it is not returned in the response after creation
    // We select the last event guide in the list as there is no other way to get the ID
    const eventGuideResponse = await axios.get(`${configurationParameters.DooApiUrl}/v1/organizers/${currentOid.organizationId}/event_guides`, sharedRequestOptions);
    const lastCreatedEventGuideId = eventGuideResponse.data._embedded.event_guides.at(-1).id;

    // Create event template
    await axios.patch(`${configurationParameters.DooApiUrl}/v1/events/${inputParameters.DraftEventId}`, {
      event_guide_id: lastCreatedEventGuideId,
    }, sharedRequestOptions);

    return {};
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
