I used this page https://stuff-things.net/2015/09/17/client-certificate-ca-setup-and-signing/

Run these commands to generate CAs and client certs:

export CERT_DIR=./certs/2022-03-08

PARTNER 1
openssl genrsa -out partner1-CA.key 2048
openssl req -x509 -new -nodes -key partner1-CA.key -days 365 -out partner1-CA.pem -subj "/C=US/ST=PA/L=Macungie/O=Partner1/OU=IT Security/CN=Partner1-CA"

PARTNER 1 CLIENT 1
openssl genrsa -out partner1-client1.key 2048
openssl req -new -key partner1-client1.key -out partner1-client1.csr -subj "/C=US/ST=PA/L=Macungie/O=Partner1/OU=IT Security/CN=Partner1-Client1"
openssl x509 -sha256 -req -in partner1-client1.csr -out partner1-client1.crt -CA partner1-CA.pem -CAkey partner1-CA.key -CAcreateserial -days 365
openssl pkcs12 -export -in partner1-client1.crt -inkey partner1-client1.key -out partner1-client1.p12 -passout pass:google


PARTNER 1 CLIENT 2
openssl genrsa -out partner1-client2.key 2048
openssl req -new -key partner1-client2.key -out partner1-client2.csr -subj "/C=US/ST=PA/L=Macungie/O=Partner1/OU=IT Security/CN=Partner1-Client2"
openssl x509 -sha256 -req -in partner1-client2.csr -out partner1-client2.crt -CA partner1-CA.pem -CAkey partner1-CA.key -CAcreateserial -days 365
openssl pkcs12 -export -in partner1-client2.crt -inkey partner1-client2.key -out partner1-client2.p12 -passout pass:google


PARTNER 2
openssl genrsa -out partner2-CA.key 2048
openssl req -x509 -new -nodes -key partner2-CA.key -days 365 -out partner2-CA.pem -subj "/C=US/ST=PA/L=Macungie/O=Partner2/OU=IT Security/CN=Partner2-CA"

PARTNER 2 CLIENT 1
openssl genrsa -out partner2-client1.key 2048
openssl req -new -key partner2-client1.key -out partner2-client1.csr -subj "/C=US/ST=PA/L=Macungie/O=Partner2/OU=IT Security/CN=Partner2-Client1"
openssl x509 -sha256 -req -in partner2-client1.csr -out partner2-client1.crt -CA partner2-CA.pem -CAkey partner2-CA.key -CAcreateserial -days 365
openssl pkcs12 -export -in partner2-client1.crt -inkey partner2-client1.key -out partner2-client1.p12 -passout pass:google


PARTNER 2 CLIENT 2
openssl genrsa -out partner2-client2.key 2048
openssl req -new -key partner2-client2.key -out partner2-client2.csr -subj "/C=US/ST=PA/L=Macungie/O=Partner2/OU=IT Security/CN=Partner2-Client2"
openssl x509 -sha256 -req -in partner2-client2.csr -out partner2-client2.crt -CA partner2-CA.pem -CAkey partner2-CA.key -CAcreateserial -days 365
openssl pkcs12 -export -in partner2-client2.crt -inkey partner2-client2.key -out partner2-client2.p12 -passout pass:google


# TEST
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:DfilsQtS1yHTbSTTGWTywbnUVktxWXUn' --cert $CERT_DIR/partner1-client1.crt --key $CERT_DIR/partner1-client1.key | jq
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:JWYoYAYoZxsjFvTvFG868cvRAqCS46cC' --cert $CERT_DIR/partner1-client2.crt --key $CERT_DIR/partner1-client2.key | jq
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:CLHWjqHWAzMSeLcpENjlj8nGkOiDHtrH' --cert $CERT_DIR/partner2-client1.crt --key $CERT_DIR/partner2-client1.key | jq
curl -s https://api2-test.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:2N2P1vrHtDlZB3Ay8U3ToqdXPzjdAbIu' --cert $CERT_DIR/partner2-client2.crt --key $CERT_DIR/partner2-client2.key | jq
# Last one fails because KVM doesn't have Partner2-Client2 whitelisted.

# PROD
curl -s https://api2.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:2Ax8uFRm2AiZ220q6L7pbirrZpPuFE2F' --cert $CERT_DIR/partner1-client1.crt --key $CERT_DIR/partner1-client1.key | jq
curl -s https://api2.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:7RotkvjbqaGJf7uaU16GJ1V5LvhfDlxi' --cert $CERT_DIR/partner1-client2.crt --key $CERT_DIR/partner1-client2.key | jq
curl -s https://api2.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:8zoGyW0eySXcCrCkurGNpshKUfDUkG4G' --cert $CERT_DIR/partner2-client1.crt --key $CERT_DIR/partner2-client1.key | jq
curl -s https://api2.kurtkanaskie.net/pingstatus-tls/v1/status -H 'X-APIKey:GGoP5gl7fZfC5bMMvbETutuKWBVI7AF1' --cert $CERT_DIR/partner2-client2.crt --key $CERT_DIR/partner2-client2.key
# Last one fails because KVM doesn't have Partner2-Client2 whitelisted.



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

