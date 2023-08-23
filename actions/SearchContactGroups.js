const axios = require("axios");
const { getAccessToken, getErrorMessage, getUserAgent } = require("../shared/shared");
const _ = require("lodash");

module.exports = {
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
      type: "string",
    },
    {
      key: "ContactGroupName",
      title: "Contact Group Name",
      type: "string",
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
  ],
};

async function handler({ inputParameters, configurationParameters, action }) {
  try {
    const accessToken = await getAccessToken(inputParameters.ClientId, inputParameters.ClientSecret, configurationParameters.DooApiUrl);

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
      ContactGroups: JSON.stringify(foundContactGroups),
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}