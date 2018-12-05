'use strict';

const apickli = require('apickli');
var config = require('../../test-config.json');
var apps = require('../../devAppKeys.json');
const {defineSupportCode} = require('cucumber');

console.log('apiconfig: [' + config.apiconfig.domain + ', ' + config.apiconfig.basepath + ']');

defineSupportCode(function({Before}) {
    Before(function() {
        this.apickli = new apickli.Apickli('https', config.apiconfig.domain + config.apiconfig.basepath);
        this.apickli.addRequestHeader('Cache-Control', 'no-cache');
        this.apickli.storeValueInScenarioScope("apiproxy", config.apiconfig.apiproxy);
        this.apickli.storeValueInScenarioScope("basepath", config.apiconfig.basepath);
        getCredsFromExport(config.apiconfig.app, config.apiconfig.product);
        console.log( "KEYS: " + keys.clientId + " " + keys.clientSecret);
        this.apickli.storeValueInScenarioScope("clientId", keys.clientId);
        this.apickli.storeValueInScenarioScope("clientSecret", keys.clientSecret);
        this.apickli.clientTLSConfig = {
            valid: {
                key: './target/test/integration/certs/partner1-client1.key',
                cert: './target/test/integration/certs/partner1-client1.crt',
                ca: './target/test/integration/certs/partner1-CA.pem',
            },
        };
    });
});

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(60 * 1000);
});

var keys = {};

// Just take the first match
function getCredsFromExport(appName, productName){
  for(var app in apps){
    if(apps[app].name === appName){
      var credentials = apps[app].credentials;
      for(var credential in credentials){
        var products = credentials[credential].apiProducts;
        for(var product in products){
          if(products[product].apiproduct === productName){
            keys.clientId = credentials[credential].consumerKey;
            keys.clientSecret = credentials[credential].consumerSecret;
          }
          break;
        }
        break;
      }
      break;
    }
  }
}



/* init.js */
/* 
'use strict';

var factory = require('./factory.js');
var config = require('../../test-config.json');

var apiproxy = config.apiconfig.apiproxy;
var basepath = config.apiconfig.basepath;
var clientId = config.apiconfig.clientId;
var clientSecret = config.apiconfig.clientSecret;

module.exports = function() {
    // cleanup before every scenario
    this.Before(function(scenario, callback) {
        this.apickli = factory.getNewApickliInstance();
        this.apickli.storeValueInScenarioScope("apiproxy", apiproxy);
        this.apickli.storeValueInScenarioScope("basepath", basepath);
        this.apickli.storeValueInScenarioScope("clientId", clientId);
        this.apickli.storeValueInScenarioScope("clientSecret", clientSecret);
        this.apickli.clientTLSConfig = {
            valid: {
                key: '../../fixtures/client1-key.pem',
                cert: '../../fixtures/client1-crt.pem',
                ca: '../../fixtures/client1-CA-crt.pem',
            }
        };
        callback();
    });
};
*/

/* factory.js */
/*
var apickli = require('apickli');
var config = require('../../test-config.json');

var defaultBasePath = config.apiconfig.basepath;
var defaultDomain = config.apiconfig.domain;

console.log('apiconfig: [' + config.apiconfig.domain + ', ' + config.apiconfig.basepath + ']');

var getNewApickliInstance = function(basepath, domain) {
    basepath = basepath || defaultBasePath;
    domain = domain || defaultDomain;

    return new apickli.Apickli('https', domain + basepath);
};

exports.getNewApickliInstance = getNewApickliInstance;
*/
