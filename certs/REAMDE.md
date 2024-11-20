I used this page https://stuff-things.net/2015/09/17/client-certificate-ca-setup-and-signing/

Run these commands to generate CAs and client certs:
cd certs
gen_client_certs.sh
gen_target_certs.sh

Now go run maven
cd ../..

Truststores and References for inbound

ONE WAY SSL CLIENT
secure-one-way --> secure-one-way-2020-02-21
	alias: api-test.kurtkanaskie.net (key, cert chain)

TWO WAY SSL CLIENT
truststore-inbound-sandbox-ref --> truststore-inbound-sandbox-2017
truststore-inbound-sandbox-2017
	aliases:
	truststore-inbound-client1-sandbox-2017 - client1-CA.pem
	truststore-inbound-client2-sandbox-2017 - client2-CA.pem

TWO WAY SSL TARGET
keystore-outbound-pingstatus-v1-sandbox-ref --> keystore-outbound-pingstatus-v1-sandbox-2017
keystore-outbound-pingstatus-v1-sandbox-2017
	alias: keystore-outbound-pingstatus-v1-sandbox

