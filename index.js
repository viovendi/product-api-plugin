const GetAllContactsForOrganization = require("./actions/GetAllContactsForOrganization");
const DeleteContact = require("./actions/DeleteContact");

module.exports = {
    title: 'Product API Connector',
    description: 'This Connery connector contains actions based on doo product API.',
    actions: [
        GetAllContactsForOrganization,
        DeleteContact,
    ],
    configurationParameters: [
        {
            key: 'DooApiUrl',
            title: 'doo API URL',
            type: 'string',
            validation: {
                required: true
            }
        },
        {
            key: 'DooApiKey',
            title: 'doo API Key',
            type: 'string',
            validation: {
                required: true
            }
        },
    ],
    maintainers: [
        {
            name: 'doo',
            email: 'support@doo.net',
        }
    ],
    connery: {
        runnerVersion: '0',
    }
};
