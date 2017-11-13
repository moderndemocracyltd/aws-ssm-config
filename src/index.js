import cacheGetConfigValues from './decorators/caching';
import AWS from 'aws-sdk';

class SsmClient {

    constructor(options) {

        this.options = {cache: false, ...options};
        
        if(this.options.cache) {
            this.getConfigValues = cacheGetConfigValues(this.getConfigValues.bind(this), options);
        }
        else {
            this.getConfigValues = this.getConfigValues.bind(this);
        }

        this.updateSsmWithValues = this.updateSsmWithValues.bind(this);
    }

    getConfigValues({path = "/", maxResults = 10, recursive = true, decrypt = true} = config, updateSsm = false, valueFactory = (params) => params) {

        console.log(`Cache miss for ${path} - loading values from SSM`);
        var ssmParams = {Path: path, MaxResults: maxResults, Recursive: recursive, WithDecryption: decrypt};

        const ssm = new AWS.SSM({apiVersion: '2014-11-06'});
        return ssm.getParametersByPath(ssmParams).promise().then((ssmResult) => {

            // SSM has returned something, so use it rather than generating values.
            if(ssmResult && ssmResult.Parameters && ssmResult.Parameters.length > 0) {
                return ssmResult; 
            }

            // ValueFactory may return either a promise or a value, so ensure either is handled
            return Promise.resolve(valueFactory(ssmResult)).then((newValues) => {

                if(updateSsm) {
                    return this.updateSsmWithValues(newValues).then(() => {return {Parameters:newValues}});
                }
                return {Parameters: newValues};
            });
        });
    }

    updateSsmWithValues(values) {

        var updatePromises = [];
        const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

        values.forEach(element => {

            // Start an update operation for each parameter we want to store
            updatePromises.push(ssm.putParameter({...element}).promise());
        });

        // Once the values have been stored, return them in the expected SSM format
        return Promise.all(updatePromises).then(() => { return {Parameters:values}}).catch((err) => {console.log(err); throw err});
    }

    clearCache() {
        if(this.options.cache) {
            this.getConfigValues.clear();
        }
    }
}

export default SsmClient;
