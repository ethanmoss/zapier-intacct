var xml2js = require('xml2js');

// Sends Request and returns SessionID from Response
const getSessionID = async (z, bundle) => {
  const promise = await z.request({
    url: bundle.authData.endpoint_url,
    method: 'POST',
    headers: { 'content-type': 'application/xml' },
    body: sessionAuthTemplate(bundle),
  })
  .then((response) => {
    response.throwForStatus();
    return response;
  });

  const sessionID = promise.data.response.operation.result.data.api.sessionid;
  bundle.authData.temp_session_ID = sessionID;

  return sessionID;
}

// Session Authentication Request JSON Template
function sessionAuthTemplate(bundle) {
  const sender_password = bundle.authData.sender_password;
  const company_id = bundle.authData.company_id;
  const user_id = bundle.authData.user_id;
  const sender_id = bundle.authData.sender_id;
  const user_password = bundle.authData.user_password;
  const timestamp = Date.now();

  var jsonObj = {
    request: {
      control: {
        senderid: sender_id,
        password: sender_password,
        controlid: timestamp,
        uniqueid: false,
        dtdversion: '3.0',
        includewhitespace: false,
      },
      operation: {
        authentication: {
          login: {
            userid: user_id,
            companyid: company_id,
            password: user_password
          }
        },
        content: {
          function: { $: {controlid: "220c4620-ed4b-4213-bfbb-10353bb73b62" },
            getAPISession: null
          }
        }
      }
    }
  };

  return jsonObj;
};

/* Before Request Middleware */

// request body must be in json format
const convertRequestToXML = (request) => {
  var requestObj = JSON.parse(request.body);
  var builder = new xml2js.Builder();

  request.body = builder.buildObject(requestObj);

  return request;
};

/* After Request Middleware */

const convertResponseToJson = (response) => {
  var parser = new xml2js.Parser({explicitArray: false});

  parser.parseString(response.content, (err, result) => {
    response.data = result;
  });

  return response;
}

module.exports = {
  config: {
    type: 'session',
    test: {
      url: '',
      method: 'GET',
      headers: {
        'X-TEMP-SESSION-ID': '{{bundle.authData.temp_session_ID}}',
        'X-ENDPOINT-URL': '{{bundle.authData.endpoint_url}}',
        'X-SENDER-PASSWORD': '{{bundle.authData.sender_password}}',
        'X-COMPANY-ID': '{{bundle.authData.company_id}}',
        'X-USER-ID': '{{bundle.authData.user_id}}',
        'X-SENDER-ID': '{{bundle.authData.sender_id}}',
        'X-USER-PASSWORD': '{{bundle.authData.user_password}}',
      },
      removeMissingValuesFrom: {},
      params: {
        temp_session_ID: '{{bundle.authData.temp_session_ID}}',
        endpoint_url: '{{bundle.authData.endpoint_url}}',
        sender_password: '{{bundle.authData.sender_password}}',
        company_id: '{{bundle.authData.company_id}}',
        user_id: '{{bundle.authData.user_id}}',
        sender_id: '{{bundle.authData.sender_id}}',
        user_password: '{{bundle.authData.user_password}}',
      },
    },
    fields: [
      { 
        computed: true, 
        key: 'temp_session_ID', 
        required: false, 
        type: 'string' 
      },
      {
        computed: false,
        key: 'endpoint_url',
        required: true,
        label: 'Endpoint URL',
        type: 'string',
        default: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
      },
      {
        computed: false,
        key: 'sender_password',
        required: true,
        label: 'Sender Password',
        type: 'password',
      },
      {
        computed: false,
        key: 'company_id',
        required: true,
        label: 'Company ID',
        type: 'string',
        default: 'EQShare-imp',
      },
      {
        computed: false,
        key: 'user_id',
        required: true,
        label: 'User ID',
        type: 'string',
        default: 'xml_clustdoc',
      },
      {
        computed: false,
        key: 'sender_id',
        required: true,
        label: 'Sender ID',
        type: 'string',
        default: 'EQShare',
      },
      {
        computed: false,
        key: 'user_password',
        required: true,
        label: 'User Password',
        type: 'password',
      },
    ],
    sessionConfig: { perform: getSessionID },
  },
  befores: [convertRequestToXML],
  afters: [convertResponseToJson],
};
