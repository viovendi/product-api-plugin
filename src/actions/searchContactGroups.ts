import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';
import { getAccessToken, getErrorMessage, getUserAgent } from '../shared/shared';
import axios from 'axios';
import { filter, map } from 'lodash';

const action: ActionDefinition = {
  key: 'searchContactGroups',
  title: 'Search contact groups',
  description:
    'Search contact groups by name or ID. If none is provided, the action returns all contact groups for the organization. The action returns the contact group with the provided ID and name if both are provided.',
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
      description: 'Contact Group ID to filter contact groups',
      type: 'string',
      validation: {
        required: false,
      },
    },
    {
      key: 'contactGroupName',
      title: 'Contact Group Name',
      description: 'Exact Contact Group Name to filter contact groups',
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
      key: 'contactGroups',
      title: 'Contact Groups',
      description: 'Contact groups found in the organization matching the search criteria.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'numberOfContactGroups',
      title: 'Number of Contact Groups',
      description: 'Number of contact groups found in the organization matching the search criteria.',
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

    const options: any = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.dooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      },
    };

    const result = await axios.get(
      `${configurationParameters.dooApiUrl}/v1/organizers/current/contact_groups`,
      options,
    );

    const contactGroups = result.data._embedded.organizer_contact_groups;

    // Filter contact groups by ID and/or name
    var foundContactGroups = [];
    if (inputParameters.contactGroupId && !inputParameters.contactGroupName) {
      // NOTE: the ID is a string in the input parameters and an integer in the API response
      foundContactGroups = filter(contactGroups, { id: parseInt(inputParameters.contactGroupId) });
    } else if (inputParameters.contactGroupName && !inputParameters.contactGroupId) {
      foundContactGroups = filter(contactGroups, { name: inputParameters.contactGroupName });
    } else if (inputParameters.contactGroupName && inputParameters.contactGroupId) {
      // NOTE: the ID is a string in the input parameters and an integer in the API response
      foundContactGroups = filter(contactGroups, {
        id: parseInt(inputParameters.contactGroupId),
        name: inputParameters.contactGroupName,
      });
    } else {
      foundContactGroups = contactGroups;
    }

    foundContactGroups = map(foundContactGroups, (contactGroup) => ({
      id: contactGroup.id,
      name: contactGroup.name,
      type: contactGroup.type,
      status: contactGroup.status,
      createdDate: contactGroup.created_date,
      updatedDate: contactGroup.updated_date,
      removedDate: contactGroup.removed_date,
      contactsCount: contactGroup.contacts_count,
      eventInvitationSubscribersCount: contactGroup.event_invitation_subscribers_count,
      eventBuyersCount: contactGroup.event_buyers_count,
      definesAttendeeType: contactGroup.defines_attendee_type,
      isUsedInScheduledCampaigns: contactGroup.is_used_in_scheduled_campaigns,
      organizationId: contactGroup.organizer_id,
      eventId: contactGroup.event_id,
    }));

    return {
      contactGroups: JSON.stringify(foundContactGroups), // The output parameter must be a string as Connery only supports string output parameters for now
      numberOfContactGroups: foundContactGroups.length.toString(), // Becasue of the array is returned as string, and becasue of the limitation of Make, we need this property to get the number of contact groups
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}
