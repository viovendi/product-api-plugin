const axios = require('axios');

async function getAccessToken(clientId, clientSecret, dooApiUrl, dooApiKey, actionKey) {
    const response = await axios.post(`${dooApiUrl}/v1/oauth`, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    },
        {
            headers: {
                'x-api-key': dooApiKey,
                'x-doo-user-agent': getUserAgent(actionKey),
            }
        })

    return response.data.data.access_token;
}

function getUserAgent(actionKey) {
    return {
        userAgent: 'connery',
        connery: {
            connector: 'viovendi/doo-product-automations',
            action: actionKey,
        }
    }
}

module.exports = {
    getAccessToken,
    getUserAgent
}