/* globals describe it */
const should = require('should');
const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run resources.vendor', async () => {
    const bundle = { 
      inputData: {
        field1: process.env.FIELD1
      },
      authData: {
        sender_id: process.env.SENDER_ID,
        sender_password: process.env.SENDER_PASSWORD,
        temp_session_ID: App.authentication.sessionConfig
      }
    };

    const results = await appTester(App.resources.vendor.list.operation.perform, bundle);
    should.exist(results);
  });
});
