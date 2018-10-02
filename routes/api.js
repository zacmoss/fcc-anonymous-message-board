/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// notes req.params.board is cutting off last letter...why???
// solved: board.html grabs board by slicing url and cuts last item assuming it a /
// so we had to add a / on the redirect to the server on post

// above incorrect, I believe database must be three deep now
// board -> thread array -> replies array in each thread

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  // Board with threads
  // GET thread
  
  // works
  app.route('/api/threads/:board')
    .get(function(req, res) {
      let messageBoard = req.params.board;

      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(messageBoard)) {
          let collection = dbo.collection(messageBoard);
          collection.find().limit(10).toArray(function(err, result) {
            console.log(result);
            res.send(result);
        });
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
      
    })
  
  
  // POST
  
  // post new thread
  // create new board if board didn't exist prior
  
  // works
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
      replies: [],
      replycount: 0
    }
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(board)) {
        dbo.createCollection(board);
        let collection = dbo.collection(board);
        collection.insertOne(threadObject);
        res.redirect('/b/' + board + '/'); // b/c board.html is grabbing the board by slicing off last item
      } else {
      let collection = dbo.collection(board);
      collection.insertOne(threadObject);
      res.redirect('/b/' + board + '/'); // b/c board.html is grabbing the board by slicing off last item
      }
    });
    
  })
    
  // PUT
  
  // DELETE
    
  
  // REPLIES
  // Full replies for threads are at /b/:board/:thread_id
  app.route('/api/replies/:board')
  
  // GET
  .get(function(req, res) {
    // /api/replies/<board>?thread_id=<thread>
    // test url --- /api/replies/FF8?thread_id=5bb3a3b7e7c0260fcc5b17be
    let board = req.params.board;
    let thread = req.query.thread_id;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(board)) {
          let collection = dbo.collection(board);
          collection.findOne({_id: ObjectId(thread)}, function(err, result) {
            if (result) {
              collection.find({_id: ObjectId(thread)}).toArray(function(err, result) {
                
                res.send(result);
                //res.send({success: 'works'});
              }) 
            } else {
              res.send({error: 'No thread under that id exists'});
            }
          });
          //collection.find().toArray(function(err, result) {
          //});
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
    
  })
  
  // POST
  // post reply
  // board thread_id text delete_password
  .post(function(req, res) {
    let messageBoard = req.params.board;
    let board = req.body.board;
    let thread = req.body.thread_id
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    console.log('board: ' + board);
    console.log('thread: ' + thread);
    
    
    let dataObject = {
      text: text,
      delete_password: delete_password,
      created_on: new Date(),
      reported: false
    }
    
    
    // update thread's bumped on date
    // create new reply dataObject in thread's replies array
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (dbo.collection(board)) {
        let collection = dbo.collection(board);
        collection.findOne({_id: ObjectId(thread)}, function(err, result) {
          //if (err) res.send({error: 'No thread exists under that id'});
          //if (err) res.send({error: 'No thread exists under that id'});
          //console.log(result.lastErrorObject);
          if (result) {
          collection.findOneAndUpdate(
            {_id: ObjectId(thread)},
            { $addToSet: {replies: dataObject}, $inc: {replycount: 1} },
            function(err, result) {
              console.log(result);
              res.send(result);
              //res.redirect('/b/' + board + threadId);
            }
          );
          } else {
            res.send({error: 'No thread exists under that id'});
          }
        });
        
      } else {
        res.json({error: 'No board exists under that name'});
      }
    });
    
  })
  
  // PUT
  
  // DELETE
  

};
