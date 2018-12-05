@intg
Feature: Error handling
	As an API consumer
	I want consistent and meaningful error responses
	So that I can handle the errors correctly

	@foo
    Scenario: GET /foo request not found
        Given I set x-apikey header to `clientId`
        When I GET /foo
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be Resource not found at /foo
        
	@foobar
    Scenario: GET /foo/bar request not found
        Given I set x-apikey header to `clientId`
        When I GET /foo/bar
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be Resource not found at /foo/bar

    @foo
    Scenario: GET /foo/bar request not found
        Given I set x-apikey header to `clientId`
        When I GET /foo/bar
        Then I should get a 404 error with message "Resource not found at /foo" and code "404.01.001"
        
