@errorHandling @test
Feature: Error handling
	As an API consumer
	I want consistent and meaningful error responses
	So that I can handle the errors correctly

	@foo
    Scenario: GET /foo request not found
        Given I have partner1_client1 client TLS configuration
        And I set x-apikey header to `clientId`
        When I GET /foo
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be No resource for GET /pingstatus-tls/v1/foo
        
	@post-foo
    Scenario: POST to /foo request not found
        Given I have partner1_client1 client TLS configuration
        And I set X-APIKey header to `clientId`
        When I POST to /foo
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be No resource for POST /pingstatus-tls/v1/foo

    @foobar
    Scenario: GET /foo/bar request not found
        Given I have partner1_client1 client TLS configuration
        And I set x-apikey header to `clientId`
        When I GET /foo/bar
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be No resource for GET /pingstatus-tls/v1/foo/bar

    @foo
    Scenario: GET /foo/bar request not found
        Given I have partner1_client1 client TLS configuration
        And I set x-apikey header to `clientId`
        When I GET /foo/bar
        Then I should get a 404 error with message "No resource for GET /pingstatus-tls/v1/foo" and code "404.001"
    
    @no-certs
    Scenario: GET /ping without certs
        Given I set x-apikey header to `clientId`
        When I GET /ping
        Then response code should be 400
        And response header Content-Type should be text/html
        And response body should contain No required SSL certificate was sent