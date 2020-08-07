@health @test @prod
Feature: API proxy health
	As API administrator
	I want to monitor Apigee proxy and backend service health
	So I can alert when it is down
    
	@get-ping
    Scenario: Verify the API proxy is responding
        Given I have partner1_client1 client TLS configuration
        And I set x-apikey header to `clientId`
		When I GET /ping
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body path $.apiproxy should be `apiproxy`
        And response body path $.client should be ^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$
        And response body path $.latency should be ^\d{1,2}
        And response body path $.message should be PONG
        And response body path $.['client.cn'] should be Partner1-Client1

	@get-status
    Scenario: Verify the backend service is responding
        Given I have partner1_client1 client TLS configuration
        And I set x-apikey header to `clientId`
		When I GET /status
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body path $.apiproxy should be `apiproxy`
        And response body path $.basepath should be `basepath`
        And response body path $.client should be ^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$
        And response body path $.latency should be ^\d{1,2}
        And response body path $.message should be STATUS
        And response body path $.['client.cn'] should be Partner1-Client1
        And response body path $.backendHeaders.['X-Client-CN'] should be Partner1-Client1
        And response body path $.backendMessage.clientDN should be pingstatus-tls-v1*

