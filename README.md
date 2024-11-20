# Ping and Status with Mutual TLS

## Disclaimer

This example is not an official Google product, nor is it part of an official Google product.

## License

This material is copyright 2019, Google LLC. and is licensed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file included.

This code is open source.

## Overview
This POC uses a mTLS virtual host with the "pingstatus-tls-v1" proxy. The proxy uses a mTLS configured Target Server (pingstatus-tls-v1) that connects to a mock proxy "pingstatus-tls-v1-mock". The response includes TLS information from both the proxy and the mock proxy.

### Solution
This POC demonstrates the use of a static API proxy mock with mutual TLS configured for both client-to-edge (pingstatus-tls-v1) and edge-to-target (pingstatus-tls-v1-mock).

![Solution Design](./pingstatus-tls-v1-poc-diagram.png)
### Prerequisites
Install the mock API proxy, it can be imported from [pingstatus-tls-v1-mock.zip](pingstatus-tls-v1-mock.zip).

Obtain certificates for your Virtual Host and create certificates for self-signed certificate authority (CA).

Configure the virtual host, keystores, truststore and associated references.
* Virtual host configured with mTLS (e.g. secure-two-way)
  * Keystore (cert chain, key) for virtual host (e.g. secure-two-way-YYYY-MM-DD with secure-two-way alias)
  ![virtual-host-keystore](virtual-host-secure-two-way-keystore.png)
  * Truststore (CA cert) for virtual host (e.g. truststore-inbound-test-YYYY) with aliases for each trusted client (e.g. Partner1-CA, Partner2-CA) including the target server (pingstatus-tls-v1-CA)
  ![virtual-host-truststore](virtual-host-secure-two-way-truststore.png)
  * References
    * ref://truststore-inbound-test --> truststore-inbound-test-YYYY
    * ref://secure-two-way --> secure-two-way-YYYY-MM-DD
  * Virtual Host Definition
```
{
  "baseUrl": "",
  "description": "",
  "hostAliases": [
    "api2-test.kurtkanaskie.net"
  ],
  "interfaces": [],
  "listenOptions": [],
  "name": "secure-two-way",
  "port": "443",
  "propagateTLSInformation": {
    "clientProperties": true,
    "connectionProperties": true
  },
  "retryOptions": [],
  "sSLInfo": {
    "ciphers": [],
    "clientAuthEnabled": "true",
    "enabled": "true",
    "ignoreValidationErrors": false,
    "keyAlias": "secure-two-way",
    "keyStore": "ref://secure-two-way",
    "protocols": [],
    "trustStore": "ref://truststore-inbound-test"
  },
  "useBuiltInFreeTrialCert": false
}
```

* Target Server (pingstatus-tls-v1) 
  * Keystore for target server (e.g. pingstatus-tls-v1-YYYY-MM-DD with pingstatus-tls-v1 alias)
  ![target-server-keystore](target-server-pingstatus-tls-v1-keystore.png)
  * References
    * ref://pingstatus-tls-v1 --> pingstatus-tls-v1-YYYY-MM-DD

### Request and Response
Partner 1 - Client 1
```
export APIKEY_1=7aOzRrSufdujdEGaeaQGOPAvnBcmXgqP
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status --header "X-APIKey: $APIKEY_1" --cert test/integration/certs/partner1-client1.crt --key test/integration/certs/partner1-client1.key
{
  "environment": "test",
  "apiproxy": "pingstatus-tls-v1",
  "basepath": "/pingstatus-tls/v1",
  "suffix": "/status",
  "client": "131.106.40.233",
  "time": "Wed, 15 Mar 2023 16:29:07 UTC",
  "proxyLatency": 312,
  "targetLatency": 35,
  "latency": 347,
  "client.cn": "Partner1-Client1",
  "client.country": "US",
  "client.email.address": "",
  "client.locality": "Trexlertown",
  "client.organization": "Partner1",
  "client.organization.unit": "IT Security",
  "client.ssl.enabled": "true",
  "client.state": "PA",
  "message": "STATUS",
  "backendHeaders": {
    "X-Client-Server-Name": "api2-test.kurtkanaskie.net",
    "X-Client-Session-ID": "a347ed784c19b921834d5ebb21eccd89634c3c9e6c26d10c7b9cc392f4ae21d2",
    "X-Client-CN": "Partner1-Client1",
    "X-Client-S-DN": "CN=Partner1-Client1",
    "X-Client-I-DN": "CN=Partner1-CA"
  },
  "backendMessage": {
    "path": "/status",
    "uri": "https://api2-test.kurtkanaskie.net/pingstatus-tls-mock/v1/status",
    "clientHost": "35.237.42.121",
    "clientDN": "target-pingstatus-tls-v1-test",
    "tls.cipher": "ECDHE-RSA-AES256-GCM-SHA384",
    "tls.protocol": "TLSv1.2",
    "tls.server.name": "api2-test.kurtkanaskie.net",
    "tls.session.id": "3b74f43105b7462c72dbca158d005618b55654731afd3cdf1c96240d28775e91",
    "tls.client.s.dn": "CN=target-pingstatus-tls-v1-test,OU=IT Security,O=Apigee,L=Trexlertown,ST=PA,C=US",
    "tls.client.i.dn": "CN=target-pingstatus-tls-v1,OU=IT Security,O=Apigee,L=Trexlertown,ST=PA,C=US",
    "tls.client.raw.cert": "-----BEGIN CERTIFICATE-----\nMIIDdTCCAl0CCQCxsVqhQ1wu+zANBgkqhkiG9w0BAQsFADB6MQswCQYDVQQGEwJV\nUzELMAkGA1UECAwCUEExFDASBgNVBAcMC1RyZXhsZXJ0b3duMQ8wDQYDVQQKDAZB\ncGlnZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSEwHwYDVQQDDBh0YXJnZXQtcGlu\nZ3N0YXR1cy10bHMtdjEwHhcNMjMwMzE1MTQyMjE0WhcNMjQwMzE0MTQyMjE0WjB/\nMQswCQYDVQQGEwJVUzELMAkGA1UECAwCUEExFDASBgNVBAcMC1RyZXhsZXJ0b3du\nMQ8wDQYDVQQKDAZBcGlnZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSYwJAYDVQQD\nDB10YXJnZXQtcGluZ3N0YXR1cy10bHMtdjEtdGVzdDCCASIwDQYJKoZIhvcNAQEB\nBQADggEPADCCAQoCggEBALbC8AZn1F6uL4EDY//BMDHDAFY90XRFnbf3qxlRJJ4N\n4V9fYl1G27qCuhCYW7PI+5fJCmAhK4L9TBfrMdJFJSiDsJnWhfUYfDxseeKB9Y3t\nB5G1W2XpXbq3hOhgcCms7d5WvnMBhTxUsUtr5wkYkuRyHkpnx9lnVLx4rd04Bvcb\njB93Vr5+PMxWaIucJL+1CcuTymQGxGFjs5nIx0Nx16VuRh8dVUHv6WPKefVFWqcc\non1f11EbvAbwfOG1ZD8FKLsmLOkLEigq48yQuuZa/Fr+8nXAcqnwlfNEZfvUI5HB\ndX0hBCvdDrfLzAMXLxLbBNeiEHLI/BGREL2WbEhkBokCAwEAATANBgkqhkiG9w0B\nAQsFAAOCAQEAFT/UYOIc01zaEER+M0V6+HHAqVqd2zLVrF+9i2YKDnEh/Ni81kpg\nyc+OeBVtsGMWoUyWCDy16v8ZuyAiXFTpBaPk6yCXh6Gh+OysbV6wKA1Rk2i3KUpU\n8wgVGF2y57uzLGsX3NX6G3vUgbNInIomvyuZ5/uIUdsSgAXfvw59lq9kK4KNxoB+\nuVZqWbQ5eUSbvZjukDSs6VKy1notZc8EO3osGggVMGap5m3YRNFtoZY4s7acVets\nKSQMqKWvHgT0cVigxCMmREHB3dqnwLxdohunnysg08WjxTYmagHzoeTZnrKL2Mfk\n0uAoZtAXF+CtT7Dp4hRa9LS72fJvGlIatQ==\n-----END CERTIFICATE-----\n",
    "tls.client.cert.serial": "B1B15AA1435C2EFB",
    "tls.client.cert.fingerprint": "c39c2f772a94226f2e8b6417931b7dea9a98d5a3",
    "client.cn": "target-pingstatus-tls-v1-test",
    "client.country": "US",
    "client.email.address": "",
    "client.locality": "Trexlertown",
    "client.organization": "Apigee",
    "client.organization.unit": "IT Security",
    "client.ssl.enabled": "true",
    "client.state": "PA",
    "status": "OK"
  }

}
```
Partner 1 - Client 2
```
export APIKEY_2=37ReaoxWFRLAYDJGNtoF5UJ07VnDOH59
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status --header "X-APIKey: $APIKEY_2" --cert test/integration/certs/partner1-client2.crt --key test/integration/certs/partner1-client2.key
{
  "environment": "test",
  "apiproxy": "pingstatus-tls-v1",
  "basepath": "/pingstatus-tls/v1",
  "suffix": "/status",
  "client": "131.106.40.233",
  "time": "Wed, 15 Mar 2023 16:30:30 UTC",
  "proxyLatency": 89,
  "targetLatency": 67,
  "latency": 156,
  "client.cn": "Partner1-Client2",
  "client.country": "US",
  "client.email.address": "",
  "client.locality": "Trexlertown",
  "client.organization": "Partner1",
  "client.organization.unit": "IT Security",
  "client.ssl.enabled": "true",
  "client.state": "PA",
  "message": "STATUS",
  "backendHeaders": {
    "X-Client-Server-Name": "api2-test.kurtkanaskie.net",
    "X-Client-Session-ID": "a8d23b7059d527ba0e91084919598d3ae7ba38959e4269f3e83bd6959f920a77",
    "X-Client-CN": "Partner1-Client2",
    "X-Client-S-DN": "CN=Partner1-Client2",
    "X-Client-I-DN": "CN=Partner1-CA"
  },
  "backendMessage": {
    "path": "/status",
    "uri": "https://api2-test.kurtkanaskie.net/pingstatus-tls-mock/v1/status",
    "clientHost": "35.237.42.121",
    "clientDN": "target-pingstatus-tls-v1-test",
    "tls.cipher": "ECDHE-RSA-AES256-GCM-SHA384",
    "tls.protocol": "TLSv1.2",
    "tls.server.name": "api2-test.kurtkanaskie.net",
    "tls.session.id": "886b41dafb2281b6fed91bb19abc0281d7b08235e3feaa5d1503ec971de0b101",
    "tls.client.s.dn": "CN=target-pingstatus-tls-v1-test,OU=IT Security,O=Apigee,L=Trexlertown,ST=PA,C=US",
    "tls.client.i.dn": "CN=target-pingstatus-tls-v1,OU=IT Security,O=Apigee,L=Trexlertown,ST=PA,C=US",
    "tls.client.raw.cert": "-----BEGIN CERTIFICATE-----\nMIIDdTCCAl0CCQCxsVqhQ1wu+zANBgkqhkiG9w0BAQsFADB6MQswCQYDVQQGEwJV\nUzELMAkGA1UECAwCUEExFDASBgNVBAcMC1RyZXhsZXJ0b3duMQ8wDQYDVQQKDAZB\ncGlnZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSEwHwYDVQQDDBh0YXJnZXQtcGlu\nZ3N0YXR1cy10bHMtdjEwHhcNMjMwMzE1MTQyMjE0WhcNMjQwMzE0MTQyMjE0WjB/\nMQswCQYDVQQGEwJVUzELMAkGA1UECAwCUEExFDASBgNVBAcMC1RyZXhsZXJ0b3du\nMQ8wDQYDVQQKDAZBcGlnZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSYwJAYDVQQD\nDB10YXJnZXQtcGluZ3N0YXR1cy10bHMtdjEtdGVzdDCCASIwDQYJKoZIhvcNAQEB\nBQADggEPADCCAQoCggEBALbC8AZn1F6uL4EDY//BMDHDAFY90XRFnbf3qxlRJJ4N\n4V9fYl1G27qCuhCYW7PI+5fJCmAhK4L9TBfrMdJFJSiDsJnWhfUYfDxseeKB9Y3t\nB5G1W2XpXbq3hOhgcCms7d5WvnMBhTxUsUtr5wkYkuRyHkpnx9lnVLx4rd04Bvcb\njB93Vr5+PMxWaIucJL+1CcuTymQGxGFjs5nIx0Nx16VuRh8dVUHv6WPKefVFWqcc\non1f11EbvAbwfOG1ZD8FKLsmLOkLEigq48yQuuZa/Fr+8nXAcqnwlfNEZfvUI5HB\ndX0hBCvdDrfLzAMXLxLbBNeiEHLI/BGREL2WbEhkBokCAwEAATANBgkqhkiG9w0B\nAQsFAAOCAQEAFT/UYOIc01zaEER+M0V6+HHAqVqd2zLVrF+9i2YKDnEh/Ni81kpg\nyc+OeBVtsGMWoUyWCDy16v8ZuyAiXFTpBaPk6yCXh6Gh+OysbV6wKA1Rk2i3KUpU\n8wgVGF2y57uzLGsX3NX6G3vUgbNInIomvyuZ5/uIUdsSgAXfvw59lq9kK4KNxoB+\nuVZqWbQ5eUSbvZjukDSs6VKy1notZc8EO3osGggVMGap5m3YRNFtoZY4s7acVets\nKSQMqKWvHgT0cVigxCMmREHB3dqnwLxdohunnysg08WjxTYmagHzoeTZnrKL2Mfk\n0uAoZtAXF+CtT7Dp4hRa9LS72fJvGlIatQ==\n-----END CERTIFICATE-----\n",
    "tls.client.cert.serial": "B1B15AA1435C2EFB",
    "tls.client.cert.fingerprint": "c39c2f772a94226f2e8b6417931b7dea9a98d5a3",
    "client.cn": "target-pingstatus-tls-v1-test",
    "client.country": "US",
    "client.email.address": "",
    "client.locality": "Trexlertown",
    "client.organization": "Apigee",
    "client.organization.unit": "IT Security",
    "client.ssl.enabled": "true",
    "client.state": "PA",
    "status": "OK"
  }
}
```

Direct to pingstatus-tls-mock/v1/status
```
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls-mock/v1/status --cert certs/2023-03-10/target-pingstatus-tls-v1-test.crt --key certs/2023-03-10/target-pingstatus-tls-v1-test.key
{
    "path" : "/status",
    "uri" : "https://api2-test.kurtkanaskie.net/pingstatus-tls-mock/v1/status",
    "clientHost":"131.106.40.233",
    "clientDN" : "target-pingstatus-tls-v1-test",
    "tls.cipher":"ECDHE-RSA-AES256-GCM-SHA384",
    "tls.protocol":"TLSv1.2",
    "tls.server.name":"api2-test.kurtkanaskie.net",
    "tls.session.id":"7daf1545389cebc401f4e8a6c265b0cecf7e0025ffae7c7524a02cd6a042b6f3",
    "tls.client.s.dn":"CN=target-pingstatus-tls-v1-test,OU=IT Security,O=Apigee,L=Macungie,ST=PA,C=US",
    "tls.client.i.dn":"CN=target-pingstatus-tls-v1,OU=IT Security,O=Apigee,L=Macungie,ST=PA,C=US",
    "tls.client.raw.cert":"-----BEGIN CERTIFICATE-----\nMIIDbzCCAlcCCQDcRb417avO3DANBgkqhkiG9w0BAQsFADB3MQswCQYDVQQGEwJV\nUzELMAkGA1UECAwCUEExETAPBgNVBAcMCE1hY3VuZ2llMQ8wDQYDVQQKDAZBcGln\nZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSEwHwYDVQQDDBh0YXJnZXQtcGluZ3N0\nYXR1cy10bHMtdjEwHhcNMjMwMzEwMTYzMzI5WhcNMjQwMzA5MTYzMzI5WjB8MQsw\nCQYDVQQGEwJVUzELMAkGA1UECAwCUEExETAPBgNVBAcMCE1hY3VuZ2llMQ8wDQYD\nVQQKDAZBcGlnZWUxFDASBgNVBAsMC0lUIFNlY3VyaXR5MSYwJAYDVQQDDB10YXJn\nZXQtcGluZ3N0YXR1cy10bHMtdjEtdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBANfGYHo8/ffpTOEBQxYVhajBa5FqcVlCMZSPl99QoQjkkHZaT39m\npcdPyK8/5koJsJi2YRhkjTr5FNinVHk0orwjtNv86q3gaQMrEOumiGwqd5vw6Vky\n5sRI1qg8B3zMjhr5CQmMZXgDHJsCgYQ5mBzp5/Cs0yraOaFHfvXYILaXSeboTqp1\nyKlISwaQJIgl7tiA8QUEtjz6KsS3NKX37mOA74vJcZbE3IzkDm2kWJQdCbD25hab\ntLAR1jYAQhIsN3EO2FUnx17scViv+jsQ29cSXQkcacydyyBc+DLydo2N+IHkRa4J\nVORrFjd+IXO0Qnk27RqqDdhb1+PCKOaovh8CAwEAATANBgkqhkiG9w0BAQsFAAOC\nAQEAeXW2T9TP9jRYRRdIYLi4mMueGGKqZsG7JLsh126c9KeovimQPSok+P9haY88\nTVqcmqRhGWyZDJuYbsljh4xEbwzxb4UDpOx345VNS4zG/45+Nzzh1Qv06yLbCpnB\nXdWmcwtN2g3+NUcT8yW1i8/+/rShTZywKh2qk1ipgKMLnIq66EbZRBUgc0erW9KZ\nD558d01cqTccK4rM/PMi0CJNkYga972/3x2I2oS0c0k2p8sEHnkJKUyw3Ek8RvhF\nmP4WKMsfpAJh+UhiPF6uJFS+ih1yqaiHcmEwld5Fkq3zmc/w1xCsmj/wo28R+Mlj\nzHo+6w37n6EEm696dXrQhaq2Gg==\n-----END CERTIFICATE-----\n",
    "tls.client.cert.serial":"DC45BE35EDABCEDC",
    "tls.client.cert.fingerprint":"6abc85ce62108b958859ab9442ad3d24759415bc",
    "client.cn":"target-pingstatus-tls-v1-test",
    "client.country":"US",
    "client.email.address":"",
    "client.locality":"Macungie",
    "client.organization":"Apigee",
    "client.organization.unit":"IT Security",
    "client.ssl.enabled":"true",
    "client.state":"PA",
    "status" : "OK"
}
```

## Installation
This CI/CD solution is based off the pingstatus-v1 example, please see details [here](https://github.com/kurtkanaskie/pingstatus-v1).

### Relationships
First: cd ../virtualhosts-keystore-cicd/keystore-cicd to update the virtual host certificates

This updates:
  * truststore-inbound-APIGEE_ENVIRONMENT-CERT_SUFFIX
  * pingstatus-tls-v1-CERT_SUFFIX

```
export CDIR=2024-03-11
export PROFILE=prod-two-way
export PROFILE=test-two-way
```

#### Process resources and run integration tests
```
cd certs
gen_client_certs.sh
gen_target_certs.sh
cd ..
cp certs/$CDIR/partner1-client1.crt test/integration/certs
cp certs/$CDIR/partner1-client1.key test/integration/certs
cp certs/$CDIR/partner1-client2.crt test/integration/certs
cp certs/$CDIR/partner1-client2.key test/integration/certs

cp certs/$CDIR/partner2-client1.crt test/integration/certs
cp certs/$CDIR/partner2-client1.key test/integration/certs
cp certs/$CDIR/partner2-client2.crt test/integration/certs
cp certs/$CDIR/partner2-client2.key test/integration/certs
```

### Install and test
All at once
```
mvn -P $PROFILE install -Ddeployment.suffix= -Dapigee.config.options=update \
  -Dapigee.config.dir=target/resources/edge \
  -Dapigee.config.exportDir=target/test/integration \
  -DConfigCertSuffix=$CDIR \
  -Dapi.testtag=@health
```

#### Process resources and for certificate update
```
mvn -P "$PROFILE" resources:copy-resources@copy-resources replacer:replace@replace -DConfigCertSuffix=$CDIR
mvn -P "$PROFILE" apigee-config:keystores 
# mvn -P "$PROFILE" apigee-config:aliases # this doesn't work via maven, have to use the UI
mvn -P "$PROFILE" apigee-config:references
mvn -P "$PROFILE" apigee-config:targetservers
```

#### Process resources and run tests
```
mvn -P "$PROFILE" process-resources apigee-config:exportAppKeys frontend:npm@integration \
  -Ddeployment.suffix= -Dskip.clean=true \
  -Dapigee.config.dir=target/resources/edge \
  -Dapigee.config.exportDir=target/test/integration \
  -Dapi.testtag=@health
```

Just re-run integration tests from target
```
mvn -P "$PROFILE" frontend:npm@integration -Dskip.clean=true -Dapigee.config.dir=target/resources/edge 
npm run integration
```

TDIR=./test/integration/certs

# TEST
```
export HOST=api2-test.kurtkanaskie.net
export P1C1KEY=DfilsQtS1yHTbSTTGWTywbnUVktxWXUn
export P1C2KEY=JWYoYAYoZxsjFvTvFG868cvRAqCS46cC
export P2C1KEY=CLHWjqHWAzMSeLcpENjlj8nGkOiDHtrH
export P2C2KEY=2N2P1vrHtDlZB3Ay8U3ToqdXPzjdAbIu
```

# PROD
```
export HOST=api2.kurtkanaskie.net
export P1C1KEY=2Ax8uFRm2AiZ220q6L7pbirrZpPuFE2F
export P1C2KEY=7RotkvjbqaGJf7uaU16GJ1V5LvhfDlxi
export P2C1KEY=8zoGyW0eySXcCrCkurGNpshKUfDUkG4G
export P2C2KEY=GGoP5gl7fZfC5bMMvbETutuKWBVI7AF1
```

```
curl -i https://$HOST/notarget --cert $TDIR/partner1-client1.crt --key $TDIR/partner1-client1.key
curl -i https://$HOST/notarget --cert $TDIR/partner2-client1.crt --key $TDIR/partner1-client1.key

curl -s https://$HOST/pingstatus-tls-mock/v1/status --cert certs/$CDIR/target-pingstatus-tls-v1-test.crt --key certs/$CDIR/target-pingstatus-tls-v1-test.key | jq
curl -s https://$HOST/pingstatus-tls-mock/v1/status --cert certs/$CDIR/target-pingstatus-tls-v1-prod.crt --key certs/$CDIR/target-pingstatus-tls-v1-prod.key | jq

curl -s https://$HOST/pingstatus-tls/v1/ping -H "X-APIKey:$P1C1KEY" --cert $TDIR/partner1-client1.crt --key $TDIR/partner1-client1.key | jq
curl -s https://$HOST/pingstatus-tls/v1/status -H "X-APIKey:$P1C1KEY" --cert $TDIR/partner1-client1.crt --key $TDIR/partner1-client1.key | jq

curl -s https://$HOST/pingstatus-tls/v1/status -H "X-APIKey:$P1C2KEY" --cert $TDIR/partner1-client2.crt --key $TDIR/partner1-client2.key | jq
curl -s https://$HOST/pingstatus-tls/v1/status -H "X-APIKey:$P2C1KEY" --cert $TDIR/partner2-client1.crt --key $TDIR/partner2-client1.key | jq
curl -s https://$HOST/pingstatus-tls/v1/status -H "X-APIKey:$P2C2KEY" --cert $TDIR/partner2-client2.crt --key $TDIR/partner2-client2.key | jq
```
Last one fails because KVM doesn't have Partner2-Client2 whitelisted.
