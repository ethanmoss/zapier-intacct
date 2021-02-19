// get a list of vendors
const performList = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
    headers: { 'content-type': 'application/xml'},
    body: listVendorsTemplate(bundle) 
  });
  return response.data
};

// List Vendors API Request JSON Template
function listVendorsTemplate(bundle) {
  const sender_password = bundle.authData.sender_password;
  const sender_id = bundle.authData.sender_id;
  const temp_session_ID = bundle.authData.temp_session_ID;
  const timestamp = Date.now();

  const field1 = bundle.inputData.field1;

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
          sessionid: temp_session_ID,
        },
        content: {
          function: { $: {controlid: "220c4620-ed4b-4213-bfbb-10353bb73b62" },
            query: {
              object: "VENDOR",
              select: {
                field: field1,
              }
            }
          }
        }
      }
    }
  };

  return jsonObj;
}

// find a particular vendor by search criteria
const performSearch = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
    headers: { 'content-type': 'application/xml' },
  });
  return response.data
};

// List Vendor API Request JSON Template
function listVendorTemplate(bundle) {
  const sender_password = bundle.authData.sender_password;
  const sender_id = bundle.authData.sender_id;
  const temp_session_ID = bundle.authData.temp_session_ID;
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
          sessionid: temp_session_ID,
        },
        content: {
          function: { $: {controlid: "220c4620-ed4b-4213-bfbb-10353bb73b62" },
            read: {
              object: "VENDOR",
              keys: '1',
              fields: '*',
            }
          }
        }
      }
    }
  };

  return jsonObj;
}

// creates a new vendor
const performCreate = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
    headers: { 'content-type': 'application/xml' },
  });
  return response.data
};

// Create Vendor API Request JSON Template
function createVendorTemplate(bundle) {
  const sender_password = bundle.authData.sender_password;
  const sender_id = bundle.authData.sender_id;
  const temp_session_ID = bundle.authData.temp_session_ID;
  const timestamp = Date.now();

  const name = bundle.inputData.name;
  const printAs = bundle.inputData.printAs;
  const companyName = bundle.inputData.companyName;

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
          sessionid: temp_session_ID,
        },
        content: {
          function: { $: {controlid: "220c4620-ed4b-4213-bfbb-10353bb73b62" },
            create: {
              vendor: {
                name: name
              },
              displayContact: {
                printAs: printAs,
                companyName: companyName,
                
                // Enter more fields for Vendor Information here
              }
            }
          }
        }
      }
    }
  };

  return jsonObj;
}

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'vendor',
  noun: 'Vendor',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Vendor',
  //     description: 'Gets a vendor.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

  //List all vendors configuration
  list: {
    display: {
      label: 'List Vendors',
      description: 'Lists the vendors.'
    },
    operation: {
      perform: performList,
      // `inputFields` defines the fields a user could provide
      // Zapier will pass them in as `bundle.inputData` later. They're optional on triggers, but required on searches and creates.
      inputFields: [
        {
          key: 'field1',
          required: true,
          label: 'Query Field 1',
          helpText: 'First Query Parameter'
        }
      ],
    }
  },

  // Find specific vendor by ID configuration
  search: {
    display: {
      label: 'Find Vendor',
      description: 'Finds a given vendor by ID.'
    },
    operation: {
      inputFields: [
      { 
        key: 'Vendor ID', 
        required: true,
        type: 'integer', 
        helpText: 'Enter Vendor ID',
      },
      ],
      perform: performSearch
    },
  },

  // Create new vendor configuration
  create: {
    display: {
      label: 'Create Vendor',
      description: 'Creates a new vendor.'
    },
    operation: {
      inputFields: [
      {
        key: 'name', 
        required: true, 
        label: 'Name of Vendor', 
        helpText: 'Enter name of Vendor',
      },
      {
        key: 'printAs', 
        required: true,
        label: 'Print As', 
        helpText: 'Enter Print As Value',
      },
      {
        key: 'companyName',
        required: false,
        label: 'Company Name',
        helpText: 'Enter Company Name of Vendor'
      }
      // What other information is needed to Create a Vendor? Insert that here.
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: {
    id: 1,
    name: 'Test'
  },

  // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
  // For a more complete example of using dynamic fields see
  // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
  // Alternatively, a static field definition can be provided, to specify labels for the fields
  // In this resource, these output fields are reused across all resources
  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
