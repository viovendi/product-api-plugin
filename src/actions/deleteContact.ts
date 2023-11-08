import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';
import { getAccessToken, getErrorMessage, getUserAgent } from '../shared/shared';
import axios from 'axios';

const action: ActionDefinition = {
  key: 'deleteContact',
  title: 'Delete contact',
  description: 'Delete contact from doo organization.',
  type: 'delete',
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
      key: 'contactId',
      title: 'Contact ID',
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
    const accessToken = await getAccessToken(
      inputParameters.clientId,
      inputParameters.clientSecret,
      configurationParameters.dooApiUrl,
      configurationParameters.dooApiKey,
      action.key,
    );

    const options: any = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.dooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      },
    };

    await axios.delete(
      `${configurationParameters.dooApiUrl}/v1/organizers/current/contacts/${inputParameters.contactId}`,
      options,
    );

    return {};
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}
