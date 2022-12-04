# aws-cognito-client-js
AWS Cognito Client JS

npm install express-session

npm install cookie-parser


npm i amazon-cognito-identity-js

npm i aws-sdk

Copy /node_modules/amazon-cognito-identity/dist/amazon-cognito-identity.min.js to dist/ folder


### Configuration

Uses https://www.npmjs.com/package/config

config/default.json

```
{
    "cognito": {
        "pool": "us-west-1_POALSDJD",
        "client": "3h7ogi91ps9frmfu729202tdrgp",
        "user": "xxx",
        "password": "82jKJALS893",
        "region": "us-west-1",
        "identity": {
            "pool": "us-west-1:029838383-4169-4f54-9ca1-k03938372",
            "logins": "cognito-idp.us-west-1.amazonaws.com/us-west-1_POALSDJD"
        }
    },
    "s3": {
        "bucket": "xxx-dev-bar",
        "prefix": "us-west-1:029838383-4169-4f54-9ca1-k03938372"
    }
}

```


### Run Application

export NODE_ENV=production

node app.js

### Access Application

localhost:3000/cognito/login

