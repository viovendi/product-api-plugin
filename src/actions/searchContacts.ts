import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';
import { getAccessToken, getErrorMessage, getUserAgent } from '../shared/shared';
import axios from 'axios';
import { map } from 'lodash';

const action: ActionDefinition = {
  key: 'searchContacts',
  title: 'Search contacts',
  description:
    'Search contacts in the doo organization. If no filter is provided, all contacts from the organization will be returned.',
  type: 'read',
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
      key: 'contactGroupId',
      title: 'Contact Group ID',
      description: 'Contact Group ID to filter contacts',
      type: 'string',
      validation: {
        required: false,
      },
    },
    {
      key: 'searchText',
      title: 'Search Text',
      description: 'Search text to filter contacts.',
      type: 'string',
      validation: {
        required: false,
      },
    },
  ],
  operation: {
    handler: handler,
  },
  outputParameters: [
    {
      key: 'contacts',
      title: 'Contacts',
      description: 'Contacts found in the organization matching the search criteria.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'numberOfContacts',
      title: 'Number of contacts',
      description: 'Number of contacts found in the organization matching the search criteria.',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
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

    const contacts = [];
    let pageNumber = 1;
    let isLastPage = false;
    while (!isLastPage) {
      var params: any = {
        sort_order: 'asc',
        sort_by: 'email',
        page_size: '50',
        page: pageNumber,
      };

      if (inputParameters.searchText) {
        params.search_text = inputParameters.searchText;
      }

      if (inputParameters.contactGroupId) {
        params.group_id = inputParameters.contactGroupId;
      }

      const headers: any = {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.dooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      };

      const result = await axios.get(`${configurationParameters.dooApiUrl}/v1/organizers/current/contacts`, {
        params,
        headers,
      });

      if (result.data.page_count <= pageNumber) {
        isLastPage = true;
      }

      const newContacts = map(result.data._embedded.organizer_contacts, (contact) => ({ id: contact.id }));
      contacts.push(...newContacts);

      pageNumber++;
    }

    return {
      contacts: JSON.stringify(contacts), // The output parameter must be a string as Connery only supports string output parameters for now
      numberOfContacts: contacts.length.toString(), // Becasue of the array is returned as string, and becasue of the limitation of Make, we need this property to get the number of contact groups
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}
