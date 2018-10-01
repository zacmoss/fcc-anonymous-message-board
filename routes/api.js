/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// notes board[0] will contain board id and delete_password for whole board

// above incorrect, I believe database must be three deep now
// board -> 

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  // THREADS
  // GET thread
  
  app.route('/api/threads/:board')
    .get(function(req, res) {
      let messageBoard = req.params.board;
    
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(messageBoard)) {
          let collection = dbo.collection(messageBoard);
          collection.find().toArray(function(err, result) {
          res.send(result);
        });
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
      
    })
  
  
  // POST
  
  // works
  .post(function(req, res) {
    let messageBoard = req.params.board;
    let board = req.body.board;
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    let dataObject = {
      text: text,
      delete_password: delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: []
    }
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(messageBoard)) dbo.createCollection(messageBoard);
      let collection = dbo.collection(messageBoard);
      collection.insertOne(dataObject);
      res.redirect('/b/' + messageBoard);
    });
    
  })
    
  // PUT
  
  // DELETE
    
  
  // REPLIES
  // I think :board here should be :thread???
  // Full replies for threads are at /b/:board/:thread_id
  app.route('/api/replies/:board')
  
  // GET
  .get(function(res, req) {
    let thread = req.params.board;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(thread)) {
          let collection = dbo.collection(thread);
          collection.find().toArray(function(err, result) {
          res.send(result);
        });
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
    
  })
  
  // POST
  // board thread_id text delete_password
  .post(function(res, req) {
    let messageBoard = req.params.board;
    let board = req.body.board;
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    
    let dataObject = {
      text: text,
      delete_password: delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false
    }
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(messageBoard)) dbo.createCollection(messageBoard);
      let collection = dbo.collection(messageBoard);
      collection.insertOne(dataObject);
      res.redirect('/b/' + messageBoard);
    });
    
  })
  
  // PUT
  
  // DELETE
  

};
