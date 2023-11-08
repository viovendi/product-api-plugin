import { PluginDefinition } from '@connery-io/sdk';
import searchContacts from './actions/searchContacts';
import searchContactGroups from './actions/searchContactGroups';
import deleteContact from './actions/deleteContact';
import createEventTemplate from './actions/createEventTemplate';

const plugin: PluginDefinition = {
  title: 'Product API plugin',
  description:
    'This plugin contains actions based on the doo product API. Every action requires valid client credentials (Client ID and Client Secret) to be passed as parameters to authenticate the API calls to the doo product API.',
  actions: [searchContacts, searchContactGroups, deleteContact, createEventTemplate],
  configurationParameters: [
    {
      key: 'dooApiUrl',
      title: 'doo API URL',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'dooApiKey',
      title: 'doo API Key',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
  maintainers: [
    {
      name: 'doo',
      email: 'support@doo.net',
    },
  ],
  connery: {
    runnerVersion: '0',
  },
};
export default plugin;
