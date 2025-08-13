// Wrap existing Express app as a Netlify Function
const serverless = require("serverless-http");
const app = require("../../src/app");

// basePath strips the Netlify function prefix so Express sees normal paths
// Example:
//  Request to /.netlify/functions/api/api/enquiries
//  basePath '/.netlify/functions/api' → Express sees '/api/enquiries'
module.exports.handler = serverless(app, {
  basePath: "/.netlify/functions/api",
});
