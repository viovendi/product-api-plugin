const axios = require('axios');
const { handler } = require('../../actions/CreateEventTemplate');
const { getAccessToken, getErrorMessage, getUserAgent } = require("../../shared/shared");

jest.mock('axios');
jest.mock('../../shared/shared', () => ({
    getAccessToken: jest.fn(),
    getErrorMessage: jest.fn((value) => value), // mock getErrorMessage to return the value passed to it
    getUserAgent: jest.fn(),
}));

// NOTE: You don't need to test whether the input parameters are provided and valid. 
// Connery Runner will handle that based on your action definition.
// So you only need to test the logic of your action here.

var mockContext = null;
var expectedOptions = null;

beforeEach(() => {
    getUserAgent.mockReturnValue({
        userAgent: 'mockUserAgent',
        connery: {
            connector: 'mockConnector',
            action: 'mockActionKey',
        }
    });

    mockContext = {
        configurationParameters: {
            DooApiUrl: 'mockDooApiUrl',
            DooApiKey: 'mockDooApiKey',
        },
        inputParameters: {
            ClientId: 'mockClientId',
            ClientSecret: 'mockClientSecret',
            DraftEventId: 'mockDraftEventId',
            EventGuideTemplate: 'mockEventGuideTemplate',
        },
        action: {
            key: 'mockActionKey'
        }
    };

    expectedOptions = {
        headers: {
            'Authorization': `Bearer mockAccessToken`,
            'x-api-key': 'mockDooApiKey',
            'x-doo-user-agent': {
                userAgent: 'mockUserAgent',
                connery: {
                    connector: 'mockConnector',
                    action: 'mockActionKey',
                }
            },
        }
    };
});

afterEach(() => {
    jest.clearAllMocks();

    mockContext = null;
    expectedOptions = null;
});

describe('handler()', () => {
    xit('should retrieve information about current orgnization', async () => {
        
    });

    xit('should create a new event guide', async () => {
    });

    xit('should pull all event guides and take the last one from the list', async () => {
    });

    xit('should create a new event template', async () => {
    });

    it('should throw an error if the access token retrieval is failed for the user', async () => {
        getAccessToken.mockRejectedValue(new Error('mockError'));

        await expect(handler(mockContext)).rejects.toThrow('mockError');
    });

    xit('should throw an error if any HTTP request is failed', async () => {
    });
});
