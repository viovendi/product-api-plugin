const axios = require('axios');
const DeleteContact = require('../actions/DeleteContact');
const { getAccessToken, getUserAgent } = require('../shared/shared');

jest.mock('axios');
jest.mock('../shared/shared');

// NOTE: You don't need to test whether the input parameters are provided and valid. 
// Connery Runner will handle that based on your action definition.
// So you only need to test the logic of your action here.

it('should delete contact and return success', async () => {
    getAccessToken.mockResolvedValue('mockedAccessToken');
    getUserAgent.mockReturnValue('mockedUserAgent');
    axios.delete.mockResolvedValue({});

    const result = await DeleteContact.operation.handler({
        inputParameters: {
            ClientId: 'testClientId',
            ClientSecret: 'testClientSecret',
            ContactId: 'testContactId'
        },
        configurationParameters: {
            DooApiUrl: 'https://api.doo.net',
            DooApiKey: 'testApiKey'
        },
        action: {
            key: 'testActionKey'
        }
    });

    expect(result.ExecutionResult).toBe('success');
});

xit('should throw error on deletion failure', async () => {
    getAccessToken.mockResolvedValue('mockedAccessToken');
    getUserAgent.mockReturnValue('mockedUserAgent');

    axios.delete.mockRejectedValueOnce({
        response: {
            status: 404,
            statusText: 'Not Found'
        }
    });

    await expect(DeleteContact.operation.handler({
        inputParameters: {
            ClientId: 'testClientId',
            ClientSecret: 'testClientSecret',
            ContactId: 'testContactId'
        },
        configurationParameters: {
            DooApiUrl: 'https://api.doo.net',
            DooApiKey: 'testApiKey'
        },
        action: {
            key: 'testActionKey'
        }
    })).rejects.toThrow('Error 404: Not Found');
});
