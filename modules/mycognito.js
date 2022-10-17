const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('config');

exports.cognitoSignIn = function () {

    const cuser = config.get('cognito.user');
    const cpwd = config.get('cognito.password');

    const cpool = config.get('cognito.pool');
    const cclient = config.get('cognito.client');

    const cregion = config.get('cognito.region');
    const cidentitypool = config.get('cognito.identity.pool');
    const cidentitylogins = config.get('cognito.identity.logins');

    console.log("Logging in as " + cuser + " using " + cpwd);

    var authenticationData = {
        Username: cuser,
        Password: cpwd,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId: cpool,
        ClientId: cclient
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: cuser,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            var idToken = result.idToken.jwtToken;

            AWS.config.region = cregion;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: cidentitypool,
                Logins: {
                    [cidentitylogins]: idToken
                }
            });

            AWS.config.credentials.get(function (err) {
                if (err) return console.error(err);
                else console.log(AWS.config.credentials);

                const cs3bucket = config.get('s3.bucket');
                const cs3prefix = config.get('s3.prefix');
                console.log(">>>> " + "Listing Bucket: " + cs3bucket + " " + cs3prefix);

                var s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    params: { Bucket: cs3bucket, Key: cs3prefix }
                });

                s3.listObjects({ Delimiter: '/' }, function (err, data) {
                    console.log(err, data)
                });
            });
        },

        onFailure: function (err) {
            console.log("ERROR: >>> " + err);
            //alert(err);
        },

    });

}