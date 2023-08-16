const DeleteContact = require("./actions/DeleteContact");

module.exports = {
    title: 'doo Product Automations',
    description: 'doo Product Automations connector for Connery',
    actions: [
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
