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
let testThreadId;
let testDeletePassword;
let testThreadIdForReplies;
let testReplyId;
let testReplyDeletePassword;
suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('Post new thread to board', function(done) {
       chai.request(server)
        .post('/api/threads/test')
        .send({text: 'This is a test thread',
               delete_password: 'password'
              })
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          // user is redirected, so not sure how to test other than 200 response
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get a board of threads', function(done) {
       chai.request(server)
        .get('/api/threads/test')
        //.query({stock: 'goog'})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          testThreadId = res.body[0]._id;
          testDeletePassword = res.body[0].delete_password;
          console.log(testThreadId);
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
    
    suite('PUT', function() {
      
      test('Report a thread', function(done) {
       chai.request(server)
        .put('/api/threads/test')
        .send({ report_id: testThreadId })
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('Delete a thread', function(done) {
       chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: testThreadId, delete_password: testDeletePassword})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      // posts a new thread to used below for reply testing
      test('Posting new thread for reply testing', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: 'This is a test thread for replies', delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
      // gets the new thread created above by grabbing board array length - 1
      test('Get a thread for reply test posting', function(done) {
       chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          let lastThread = res.body.length - 1;
          //console.log('test');
          //console.log(lastThread);
          testThreadIdForReplies = res.body[lastThread]._id;
          testDeletePassword = res.body[lastThread].delete_password;
          done();
        });
      });
      
      test('Post new reply to thread', function(done) {
       chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: testThreadIdForReplies,
               text: 'This is a test reply',
               delete_password: 'password'
              })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get a thread with replies', function(done) {
       chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: testThreadIdForReplies})
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log(res.body);
          testReplyId = res.body.replies[0]._id;
          testReplyDeletePassword = res.body.replies[0].delete_password;
          assert.property(res.body, '_id', 'first item in array should contain id');
          assert.property(res.body, 'text', 'first item in array should contain text');
          assert.property(res.body, 'delete_password', 'first item in array should contain delete_password');
          assert.property(res.body, 'created_on', 'first item in array should contain created_on');
          assert.property(res.body, 'bumped_on', 'first item in array should contain bumped_on');
          assert.property(res.body, 'reported', 'first item in array should contain reported');
          assert.property(res.body, 'replies', 'first item in array should contain replies');
          assert.property(res.body, 'replycount', 'first item in array should contain replycount');
          assert.isArray(res.body.replies, 'replies should be an array');
          assert.isAbove(res.body.replies.length, 0);
          
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('Report a reply', function(done) {
       chai.request(server)
        .put('/api/replies/test')
        .send({ thread_id: testThreadId, reply_id: testReplyId })
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('Delete a thread', function(done) {
       chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: testThreadId, delete_password: testDeletePassword})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
  });

});
