# aws-ssm-config
AWS SSM Configuration Client

The AWS SSM Configuration Client fetches configuration data from EC2's Parameter Store  by path.  The data in the parameter store can be encrypted, allowing secure storage of secrets, such as database connection strings, usernames and passwords.

The component can optionally cache the results from the Parameter Store, with a default expiry of 1 minute.  If a parameter isnt found, an optional Value Factory callback can be provided to allow creation of the configuration values (e.g. aquiring an access token).  Once the value has been created, it can optionally be stored in the SSM Parameter Store for future retrieval.

This component has been designed to work with AWS Lambda, caching the values to reduce the time taken to execute a function, thus minimising the billing amount.

Example usage is outlined below.

```javascript
import SsmClient from 'aws-ssm-config';

export default class MyClass {

    constructor() {
        this.config = new SsmClient({cache: true});
    }

    getConfigValues() {
        
        this.this.config.getConfigValues({path: "/common/dbconnectionstring/", recursive: true, decrypt: true, maxItems: 2}).then((params) => {
            // Do something with the config values.
        });
    }
}
```
An example AWS Role Policy is outlined below, indicating the required trust relationships

```javascript
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "ssm.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

The sample below outlines the required scopes for the AWS role invoking the function - the example assumes its a Lambda function
```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParametersByPath",
                "ssm:PutParameter"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```


