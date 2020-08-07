/* jslint node: true */
'use strict';

const {Then} = require('cucumber');

Then('I should get a {int} error with message {string} and code {string}', function (statusCode, errorMessage, errorCode, callback) {
    var assertion = this.apickli.assertPathInResponseBodyMatchesExpression('$.message', errorMessage);
	if (!assertion.success) {
		callback(JSON.stringify(assertion));
		return;
	}

	assertion = this.apickli.assertPathInResponseBodyMatchesExpression('$.code', errorCode);
	if (!assertion.success) {
		callback(JSON.stringify(assertion));
		return;
	}
	
	assertion = this.apickli.assertResponseCode(statusCode.toString());
	if (assertion.success) {
		callback();
	} else {
		callback(JSON.stringify(assertion));
	}
  });
