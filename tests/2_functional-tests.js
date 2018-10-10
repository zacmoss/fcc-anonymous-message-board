/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('Post new thread to board', function(done) {
       chai.request(server)
        .post('/api/threads/test')
        .send({text: 'This is a test thread',
               delete_password: 'password',
               created_on: new Date(),
               bumped_on: new Date(),
               reported: false,
               replies: [],
               replycount: 0
              })
        .end(function(err, res){
          console.log(res.body);
          assert.equal(res.status, 200);
         /*
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], '_id', 'first item in array should contain id');
          assert.property(res.body[0], 'text', 'first item in array should contain text');
          assert.property(res.body[0], 'delete_password', 'first item in array should contain delete_password');
          assert.property(res.body[0], 'created_on', 'first item in array should contain created_on');
          assert.property(res.body[0], 'bumped_on', 'first item in array should contain bumped_on');
          assert.property(res.body[0], 'reported', 'first item in array should contain reported');
          assert.property(res.body[0], 'replies', 'first item in array should contain replies');
          assert.property(res.body[0], 'replycount', 'first item in array should contain replycount');
          assert.isArray(res.body[0].replies, 'replies should be an array');
          */
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get a board of threads', function(done) {
       chai.request(server)
        .get('/api/threads/general')
        //.query({stock: 'goog'})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
         
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], '_id', 'first item in array should contain id');
          assert.property(res.body[0], 'text', 'first item in array should contain text');
          assert.property(res.body[0], 'delete_password', 'first item in array should contain delete_password');
          assert.property(res.body[0], 'created_on', 'first item in array should contain created_on');
          assert.property(res.body[0], 'bumped_on', 'first item in array should contain bumped_on');
          assert.property(res.body[0], 'reported', 'first item in array should contain reported');
          assert.property(res.body[0], 'replies', 'first item in array should contain replies');
          assert.property(res.body[0], 'replycount', 'first item in array should contain replycount');
          assert.isArray(res.body[0].replies, 'replies should be an array');
          
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
