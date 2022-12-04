const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('config');

exports.cognitoSignIn = function (uname, upwd) {

    let cresult = {};

    console.log(`User: ${uname}, Password: ${upwd}`); 

    const cuser = uname;
    const cpwd = upwd;

    const cpool = config.get('cognito.pool');
    const cclient = config.get('cognito.client');

    const cregion = config.get('cognito.region');
    const cidentitypool = config.get('cognito.identity.pool');
    const cidentitylogins = config.get('cognito.identity.logins');

    console.log("Logging in as " + cuser + " using " + cpwd);

    // Authentication Data
    var authenticationData = {
        Username: cuser,
        Password: cpwd,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    // User Pool
    var poolData = {
        UserPoolId: cpool,
        ClientId: cclient
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // User Data
    var userData = {
        Username: cuser,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log("Success " + result.idToken.jwtToken);
            var accessToken = result.getAccessToken().getJwtToken();
            var idToken = result.idToken.jwtToken;
            return {
                "IdToken" : idToken
            }
        },

        onFailure: function (err) {
            console.log("ERROR: >>> " + err);
            //alert(err);
        },
        
    });
    
    return cresult;
    
}



 function asyncAuthenticateUser(cognitoUser, authenticationDetails) {
    return new Promise(function(resolve, reject) {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: resolve,
            onFailure: reject,
        })
    });
    
}


exports.asyncCognitoSignIn = async function (uname, upwd, callback) {

    let cresult = {};

    console.log(`User: ${uname}, Password: ${upwd}`); 

    const cuser = uname;
    const cpwd = upwd;

    const cpool = config.get('cognito.pool');
    const cclient = config.get('cognito.client');

    const cregion = config.get('cognito.region');
    const cidentitypool = config.get('cognito.identity.pool');
    const cidentitylogins = config.get('cognito.identity.logins');

    console.log("Logging in as " + cuser + " using " + cpwd);

    // Authentication Data
    var authenticationData = {
        Username: cuser,
        Password: cpwd,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    // User Pool
    var poolData = {
        UserPoolId: cpool,
        ClientId: cclient
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // User Data
    var userData = {
        Username: cuser,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    try {
        let result = await asyncAuthenticateUser(cognitoUser, authenticationDetails)
    
        if ('idToken' in result) {
          //console.log('We have a token:  ' + JSON.stringify(result));
          cresult.IdToken = result.idToken.jwtToken;
          callback(cresult);
        } else {
          console.log('We need a new password.')
          delete result.email_verified // Not accepted by the challenge call
          delete result.phone_number_verified // Also not accepted
    
          // Get a new password from the user then call
          // cognitoUser.completeNewPasswordChallenge()
        };
    } catch (error) {
          // Probably a mis-typed password
          console.log(error.message)
    }
    

    return cresult;
    
}




exports.cognitoSignIn2 = function (uname, upwd) {

    let cresult = {};

    console.log(`User: ${uname}, Password: ${upwd}`); 

    const cuser = uname;
    const cpwd = upwd;

    const cpool = config.get('cognito.pool');
    const cclient = config.get('cognito.client');

    const cregion = config.get('cognito.region');
    const cidentitypool = config.get('cognito.identity.pool');
    const cidentitylogins = config.get('cognito.identity.logins');

    console.log("Logging in as " + cuser + " using " + cpwd);

    // Authentication Data
    var authenticationData = {
        Username: cuser,
        Password: cpwd,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    // User Pool
    var poolData = {
        UserPoolId: cpool,
        ClientId: cclient
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // User Data
    var userData = {
        Username: cuser,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    try {
        asyncAuthenticateUser(cognitoUser, authenticationDetails).then({
            function(result) { 
        
                console.log("Success");
                if ('idToken' in result) {
                    console.log('We have a token:  ' + JSON.stringify(result));
                    cresult.IdToken = result.idToken.jwtToken;
                } else {
                    console.log('We need a new password.')
                    delete result.email_verified // Not accepted by the challenge call
                    delete result.phone_number_verified // Also not accepted
            
                    // Get a new password from the user then call
                    // cognitoUser.completeNewPasswordChallenge()
                };
        
            },
            function(error) { console.log(error); }
        });
    
    } catch (error) {
          // Probably a mis-typed password
          console.log(error.message)
    }
    

    return cresult;
    
}