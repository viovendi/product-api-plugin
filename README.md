# Product API plugin

This plugin contains actions based on the doo product API. Every action requires valid client credentials (Client ID and Client Secret) to be passed as parameters to authenticate the API calls to the doo product API.

## Available actions

| Action                                                       | Description                                                                                                                                                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Search contacts](/src/actions/searchContacts.ts)            | Search contacts in the doo organization. If no filter is provided, all contacts from the organization will be returned.                                                                                        |
| [Search contact groups](/src/actions/searchContactGroups.ts) | Search contact groups by name or ID. If none is provided, the action returns all contact groups for the organization. The action returns the contact group with the provided ID and name if both are provided. |
| [Delete contact](/src/actions/deleteContact.ts)              | Delete contact from doo organization.                                                                                                                                                                          |
| [Create event template](/src/actions/createEventTemplate.ts) | Create a new event template based on a draft event and an event guide.                                                                                                                                         |

## Repository structure

The entry point for this plugin is the [./src/index.ts](/src/index.ts) file.
It contains the plugin definition and references to all the actions.

The [./src/actions/](/src/actions/) folder contains all the actions this plugin defines.
Every action is represented by a separate file with the action definition and implementation.

The [./dist/plugin.js](/dist/plugin.js) file is the bundled version of the plugin with all the dependencies.
Connery Platform uses this file to run the plugin.

## Connery

This repository is a plugin for [Connery](https://connery.io).

Connery is an open-source plugin ecosystem for AI and No-Code.

Learn more about Connery:

- [Documentation](https://docs.connery.io)
- [Source code](https://github.com/connery-io/connery-platform)
- [How to start using this plugin with Connery?](https://docs.connery.io/docs/platform/quick-start/)

## Support

If you have any questions or need help with this plugin, please create an issue in this repository.
