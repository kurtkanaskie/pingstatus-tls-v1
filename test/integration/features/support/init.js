'use strict';

const apickli = require('apickli');
var config = require('../../test-config.json');
var apps = require('../../devAppKeys.json');
var keys = {};
var keys1 = {};
var keys2 = {};

console.log('API: https://' + config.apiconfig.domain + config.apiconfig.basepath);
getCredsFromExport(config.apiconfig.app1, config.apiconfig.product, keys1);
console.log( "App " + config.apiconfig.app1 + " KEYS " + keys1.clientId + " " + keys1.clientSecret);

getCredsFromExport(config.apiconfig.app2, config.apiconfig.product, keys2);
console.log( "App " + config.apiconfig.app2 + " KEYS " + keys2.clientId + " " + keys2.clientSecret);


const {Before, setDefaultTimeout} = require('cucumber');

Before(function() {
    this.apickli = new apickli.Apickli('https', config.apiconfig.domain + config.apiconfig.basepath);
    this.apickli.addRequestHeader('Cache-Control', 'no-cache');
    this.apickli.storeValueInScenarioScope("apiproxy", config.apiconfig.apiproxy);
    this.apickli.storeValueInScenarioScope("basepath", config.apiconfig.basepath);
    
    this.apickli.storeValueInScenarioScope("clientId1", keys1.clientId);
    this.apickli.storeValueInScenarioScope("clientSecret1", keys1.clientSecret);

    this.apickli.storeValueInScenarioScope("clientId2", keys2.clientId);
    this.apickli.storeValueInScenarioScope("clientSecret2", keys2.clientSecret);

    this.apickli.clientTLSConfig = {
        partner1_client1: {
            key: './target/test/integration/certs/partner1-client1.key',
            cert: './target/test/integration/certs/partner1-client1.crt'
        },
        partner1_client2: {
            key: './target/test/integration/certs/partner1-client2.key',
            cert: './target/test/integration/certs/partner1-client2.crt'
        }
    };
});

setDefaultTimeout(60 * 1000);

// Just take the first match, no expiry or status available
function getCredsFromExport(appName, productName, keys){
  for(var app in apps){
    if(apps[app].name === appName){
      var credentials = apps[app].credentials;
      for(var credential in credentials){
        var products = credentials[credential].apiProducts;
        for(var product in products){
          if(products[product].apiproduct === productName){
            keys.clientId = credentials[credential].consumerKey;
            keys.clientSecret = credentials[credential].consumerSecret;
            return;
          }
        }
      }
    }
  }
}