const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');

const vendorResource = require("./resources/vendor");

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication,

  /* Zapier Middleware */
  beforeRequest: [...befores],

  afterResponse: [...afters],

  resources: {
    [vendorResource.key]: vendorResource
  }
};