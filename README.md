# aws-ssm-config
AWS SSM Configuration Client

The AWS SSM Configuration Client fetches configuration data from EC2's Parameter Store  by path.  The data in the parameter store can be encrypted, allowing secure storage of secrets, such as database connection strings, usernames and passwords.

Example usage is outlined below.

```javascript
import SsmClient from 'aws-ssm-config';

export default class MyClass {

    constructor() {
        this.config = new SsmClient({cache: true});
    }

    getConfigValues(createEvent, createContext) {
        
        this.this.config.getConfigValues({path: "/common/dbconnectionstring/", recursive: true, decrypt: true, maxItems: 2}).then((params) => {
            // Do something with the config values.
        });
    }
}
```


