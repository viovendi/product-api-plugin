import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';
import { getAccessToken, getErrorMessage, getInfoAboutCurrentOrganization, getUserAgent } from '../shared/shared';
import axios from 'axios';

const action: ActionDefinition = {
  key: 'createEventTemplate',
  title: 'Create event template',
  description: 'Create a new event template based on a draft event and an event guide.',
  type: 'create',
  inputParameters: [
    {
      key: 'clientId',
      title: 'Client ID',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'clientSecret',
      title: 'Client Secret',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'draftEventId',
      title: 'Draft event ID',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'eventGuideTemplate',
      title: 'Event guide template',
      description: 'Event guide template in JSON string format according to the specification.',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
  operation: {
    handler: handler,
  },
  outputParameters: [],
};
export default action;

export async function handler({
  inputParameters,
  configurationParameters,
}: ActionContext): Promise<OutputParametersObject> {
  try {
    // Get access token
    const accessToken = await getAccessToken(
      inputParameters.clientId,
      inputParameters.clientSecret,
      configurationParameters.dooApiUrl,
      configurationParameters.dooApiKey,
      action.key,
    );

    // Set shared request options
    const sharedRequestOptions: any = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.dooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      },
    };

    // Get current OID
    const currentOid = await getInfoAboutCurrentOrganization(
      accessToken,
      configurationParameters.dooApiUrl,
      configurationParameters.dooApiKey,
      action.key,
    );

    // Create event guide
    const eventGuideTemplate = JSON.parse(inputParameters.eventGuideTemplate);
    await axios.post(
      `${configurationParameters.dooApiUrl}/v1/organizers/${currentOid.organizationId}/event_guides`,
      eventGuideTemplate,
      sharedRequestOptions,
    );

    // Get event guide ID as it is not returned in the response after creation
    // We select the last event guide in the list as there is no other way to get the ID
    const eventGuideResponse = await axios.get(
      `${configurationParameters.dooApiUrl}/v1/organizers/${currentOid.organizationId}/event_guides`,
      sharedRequestOptions,
    );
    const lastCreatedEventGuideId = eventGuideResponse.data._embedded.event_guides.at(-1).id;

    // Create event template
    await axios.patch(
      `${configurationParameters.dooApiUrl}/v1/events/${inputParameters.draftEventId}`,
      {
        event_guide_id: lastCreatedEventGuideId,
      },
      sharedRequestOptions,
    );

    return {};
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}
