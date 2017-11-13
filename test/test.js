import assert from 'assert';
import SsmClient from '../lib';
import AWS from 'aws-sdk-mock';

describe('SsmClient', function(){
  describe('#getConfigValues()', function(){
    it('should return configuration values when they are present', function(){

        AWS.mock('SSM', 'getParametersByPath', function(params, callback){
        
            // Assert that the correct parameters are passed through
            assert.equal(params.Path, "/");
            assert.equal(params.MaxResults, 10);
            assert.equal(params.Recursive, true);
            assert.equal(params.WithDecryption, true);

            callback(null, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]});
        });

        var ssmClient = new SsmClient({cache: false});
        var values = ssmClient.getConfigValues({path: "/"})
            .then((params) => assert.deepEqual(params, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]}))
            .catch((err) => assert.fail(err));

        AWS.restore('SSM', 'getParametersByPath');
    })
  })
});

describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should return configuration values when they are present, limiting results to 5', function(){
  
          AWS.mock('SSM', 'getParametersByPath', function(params, callback){
          
              // Assert that the correct parameters are passed through
             assert.equal(params.Path, "/");
              assert.equal(params.MaxResults, 5);
              assert.equal(params.Recursive, true);
              assert.equal(params.WithDecryption, true);
  
              callback(null, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]});
          });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/", maxResults: 5})
              .then((params) => assert.deepEqual(params, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
      })
    })
  });

  describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should return configuration values when they are present, not recursing', function(){
  
          AWS.mock('SSM', 'getParametersByPath', function(params, callback){
          
              // Assert that the correct parameters are passed through
             assert.equal(params.Path, "/");
              assert.equal(params.MaxResults, 10);
              assert.equal(params.Recursive, false);
              assert.equal(params.WithDecryption, true);
  
              callback(null, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]});
          });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/", recursive: false})
              .then((params) => assert.deepEqual(params, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
      })
    })
  });

  describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should return configuration values when they are present, not decrypting', function(){
  
          AWS.mock('SSM', 'getParametersByPath', function(params, callback){
          
              // Assert that the correct parameters are passed through
             assert.equal(params.Path, "/");
              assert.equal(params.MaxResults, 10);
              assert.equal(params.Recursive, true);
              assert.equal(params.WithDecryption, false);
  
              callback(null, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]});
          });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/", decrypt: false})
              .then((params) => assert.deepEqual(params, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
      })
    })
  });

describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should generate configuration values when none are present, given a suitable factory method', function(){
  
        AWS.mock('SSM', 'getParametersByPath', function(params, callback){
            callback(null, {Parameters: []});
        });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/"}, false, (params) => {
              assert.deepEqual(params, {Parameters: []}) ;
              return [{Name: "A", Type: "String", Value:"abc"}
            ]})
              .then((result) => assert.deepEqual(result, {Parameters: [{Name: "A", Type: "String", Value:"abc"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
      })
    })
  });

  describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should generate configuration values when none are present, given a suitable factory method', function(){
  
        AWS.mock('SSM', 'getParametersByPath', function(params, callback){
            callback(null, {Parameters: []});
        });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/"}, false, (params) => {
              assert.deepEqual(params, {Parameters: []}) ;
              return [{Name: "A", Type: "String", Value:"abc"}, {Name: "B", Type: "String", Value:"def"}]})
              .then((result) => assert.deepEqual(result, {Parameters: [{Name: "A", Type: "String", Value:"abc"}, {Name: "B", Type: "String", Value:"def"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
      })
    })
  });

  describe('SsmClient', function(){
    describe('#getConfigValues()', function(){
      it('should generate configuration values when none are present, given a suitable factory method and updates SSM', function(){
  
        AWS.mock('SSM', 'getParametersByPath', function(params, callback){
            callback(null, {Parameters: []});
        });

        AWS.mock('SSM', 'putParameter', function (params, callback) {
            callback(null);
        });
  
          var ssmClient = new SsmClient({cache: false});
          var values = ssmClient.getConfigValues({path: "/"}, true, (params) => {
              assert.deepEqual(params, {Parameters: []}) ;
              return [{Name: "A", Type: "String", Value:"abc"}, {Name: "B", Type: "String", Value:"def"}]})
              .then((result) => assert.deepEqual(result, {Parameters: [{Name: "A", Type: "String", Value:"abc"}, {Name: "B", Type: "String", Value:"def"}]}))
              .catch((err) => assert.fail(err));

            AWS.restore('SSM', 'getParametersByPath');
            AWS.mock('SSM', 'putParameter');
      })
    })
  });