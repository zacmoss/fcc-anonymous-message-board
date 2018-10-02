/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// notes req.params.board is cutting off last letter...why???

// above incorrect, I believe database must be three deep now
// board -> thread array -> replies array in each thread

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  // Board with threads
  // GET thread
  
  app.route('/api/threads/:board')
    .get(function(req, res) {
      let messageBoard = req.params.board;
      console.log('req.params.board at api get');
      console.log(req.url);
      console.log(messageBoard);
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(messageBoard)) {
          let collection = dbo.collection(messageBoard);
          collection.find().toArray(function(err, result) {
          res.send(result);
          console.log(result);
          console.log(req.params.board);
          console.log(messageBoard);
        });
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
      
    })
  
  
  // POST
  
  // post new thread
  // create new board if board didn't exist prior
  .post(function(req, res) {
    let messageBoard = req.params.board;
    let board = req.body.board;
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    // thread object
    let threadObject = {
      text: text,
      delete_password: delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: []
    }
    console.log('post to - ' + board);
    console.log('text: ' + text);
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(board)) {
        dbo.createCollection(board);
        let collection = dbo.collection(board);
        collection.insertOne(threadObject);
        res.redirect('/b/' + board);
      } else {
      let collection = dbo.collection(board);
      collection.insertOne(threadObject);
      res.redirect('/b/' + board);
      }
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
