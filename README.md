# Product API Connector

This Connery connector contains actions based on doo product API.

Every action requires valid client credentials (Client ID and Client Secret) to be passed as parameters to authenticate the API calls to the doo product API.

## Available actions

| Action                                                   | Description                                                                                                                                                                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Create event template](/actions/CreateEventTemplate.js) | Create a new event template based on a draft event and an event guide.                                                                                                                                          |
| [Delete contact](/actions/DeleteContact.js)              | Delete contact from doo organization.                                                                                                                                                                           |
| [Search contact groups](/actions/SearchContactGroups.js) | Search contact groups by name or ID. If none is provided, the action returns all contact groups for the organization. If both are provided, the action returns the contact group with the provided ID and name. |
| [Search contacts](/actions/SearchContacts.js)            | Search contacts in doo organization. If no filter is provided, all contacts from the organization will be returned.                                                                                             |

## Repository structure

The entry point for this connector is the `./index.js` file.
It contains the connector definition and references to all the actions.

The `./actions/` folder contains all the actions this connector defines.
Every action is represented by a separate file with the action definition and implementation.

The `./dist/connector.js` file is the compiled version of the connector with all the dependencies.
Connery Runner uses this file to run the connector.

## Connery

This repository is a [Connery](https://connery.io) connector.

Connery is an open-source connector ecosystem for AI and No-Code.

Learn more about Connery:

- [Documentation](https://docs.connery.io)
- [Source code](https://github.com/connery-io/connery)
- [A quick guide on how to start using this connector with Connery](https://docs.connery.io/docs/quick-start)

## Support

If you have any questions or need help with this connector, please create an issue in this repository.
