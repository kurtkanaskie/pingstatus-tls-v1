/* globals context */
/* globals print */
/* Check to see if client.cn is in list of client.cns from the KVM populated in private.flow.client.cns */
/* Could also use API Product to hold list of client.cns populated in verifyapikey.VA-header.apiproduct.custom.client.cns */

var cnsList = context.getVariable("private.flow.client.cns");
var cn = context.getVariable("client.cn");
print( "cns: " + cnsList);
print( "cn: " + cn);

var valid = false;
if( cnsList !== null ) {
    var cns = cnsList.split(",");
    for(var i = 0; i<cns.length; i++) {
        print( "CN: " + cns[i]);
        if( cns[i] === cn ) {
            valid = true;
        }
    }
}
context.setVariable( "flow.valid.client.cn", valid);
