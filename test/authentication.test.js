const zapier = require('zapier-platform-core');
const authentication = require('../authentication');
const { config } = require('../authentication');

const App = require('../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Session Auth Test', () => {

    it('Checks to see if request has a successful exchange for sessionID credentials', async () => {
        const bundle = {
            authData: {
                endpoint_url: process.env.ENDPOINT_URL,
                sender_password: process.env.SENDER_PASSWORD,
                company_id: process.env.COMPANY_ID,
                user_id: process.env.USER_ID,
                sender_id: process.env.SENDER_ID,
                user_password: process.env.USER_PASSWORD,
            },
        };
        const newSessionID = await appTester(App.authentication.sessionConfig.perform, bundle);

        // If 'newSessionID' is undefined, like in a failed request, test will fail
        expect(newSessionID).toBeDefined();
    });
});