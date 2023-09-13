const axios = require("axios");
const { getAccessToken, getErrorMessage, getUserAgent } = require("../shared/shared");
const _ = require("lodash");

const action = {
  key: "SearchContactGroups",
  title: "Search contact groups",
  description: `
    Search contact groups by name or ID.
    If none is provided, the action returns all contact groups for the organization.
    If both are provided, the action returns the contact group with the provided ID and name.`,
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
      description: "Contact Group ID to filter contact groups",
      type: "string",
      validation: {
        required: false,
      },
    },
    {
      key: "ContactGroupName",
      title: "Contact Group Name",
      description: "Contact Group Name to filter contact groups",
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
      key: "ContactGroups",
      title: "Contact Groups",
      description: "Contact groups found in the organization matching the search criteria.",
      type: "string",
      validation: {
        required: true,
      },
    },
    {
      key: "NumberOfContactGroups",
      title: "Number of Contact Groups",
      description: "Number of contact groups found in the organization matching the search criteria.",
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

    const result = await axios.get(`${configurationParameters.DooApiUrl}/v1/organizers/current/contact_groups`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': configurationParameters.DooApiKey,
        'x-doo-user-agent': getUserAgent(action.key),
      }
    });

    const contactGroups = result.data._embedded.organizer_contact_groups;

    // Filter contact groups by ID and/or name
    var foundContactGroups = [];
    if (inputParameters.ContactGroupId && !inputParameters.ContactGroupName) {
      // NOTE: the ID is a string in the input parameters and an integer in the API response
      foundContactGroups = _.filter(contactGroups, { id: parseInt(inputParameters.ContactGroupId) });
    } else if (inputParameters.ContactGroupName && !inputParameters.ContactGroupId) {
      foundContactGroups = _.filter(contactGroups, { name: inputParameters.ContactGroupName });
    } else if (inputParameters.ContactGroupName && inputParameters.ContactGroupId) {
      // NOTE: the ID is a string in the input parameters and an integer in the API response
      foundContactGroups = _.filter(contactGroups, { id: parseInt(inputParameters.ContactGroupId), name: inputParameters.ContactGroupName });
    } else {
      foundContactGroups = contactGroups;
    }

    foundContactGroups = _.map(foundContactGroups, contactGroup => ({
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
      ContactGroups: JSON.stringify(foundContactGroups), // The output parameter must be a string as Connery only supports string output parameters for now
      NumberOfContactGroups: foundContactGroups.length.toString(), // Becasue of the array is returned as string, and becasue of the limitation of Make, we need this property to get the number of contact groups
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
