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
            let newArray = []
            // iterate through result array
            // forEach, reduce replies array to 3
            // save as newArray
            // res.send(newArray)
            result.forEach(function(ele) {
              if (ele.replycount > 3) {
                //console.log('reduce this one');
                let reducedReplies = [ele.replies[0], ele.replies[1], ele.replies[2]]
                let reducedEle = {
                  _id: ele._id,
                  text: ele.text,
                  delete_password: ele.delete_password,
                  created_on: ele.created_on,
                  bumped_on: ele.bumped_on,
                  reported: ele.reported,
                  replies: reducedReplies,
                  replycount: ele.replycount
                }
                newArray.push(reducedEle);
              } else {
                newArray.push(ele);
              }
            });
            //console.log(newArray);
            res.send(newArray);
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
  .put(function(req, res) {
    let board = req.params.board;
    let thread = req.body.thread_id;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      
    });
    
  })
  
  // DELETE
  // works
  .delete(function(req, res) {
    let board = req.params.board;
    let thread = req.body.thread_id;
    let password = req.body.delete_password;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(board)) {
        res.send('No message board under that title');
      } else {
        let collection = dbo.collection(board);
        collection.findOne({_id: ObjectId(thread)}, function(err, result) {
          if (result) {
            if (result.delete_password === password) {
              try {
                collection.deleteOne({_id: ObjectId(thread)});
                res.send('success');
              } catch (e) {
                console.log(e);
                res.text('thread not deleted.');
              }
            } else {
              res.send('password incorrect');
            }
          } else {
            res.send('No thread under that id');
          }
        })
      }
    });
    
  })
  
  
    
  
  // REPLIES
  // Full replies for a thread are at /b/:board/:thread_id
  app.route('/api/replies/:board')
  
  // works
  // GET
  .get(function(req, res) {
    // /api/replies/<board>?thread_id=<thread>
    // test url --- /api/replies/FF8?thread_id=5bb3ceb5452cf407c2a13aa6
    let board = req.params.board;
    let thread = req.query.thread_id;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (dbo.collection(board)) {
        let collection = dbo.collection(board);
        collection.findOne({_id: ObjectId(thread)}, function(err, result) {
          if (result) {

            collection.find({_id: ObjectId(thread)}).toArray(function(err, result) {
              console.log(result);
              // this is not shown by the UI, the client touches this api and gets result[0]
              // then /views/thread.html shows this result
              // result[0] b/c we use toArray during the find
              res.send(result[0]);

            }) 
          } else {
            res.send({error: 'No thread under that id exists'});
          }
        });
      } else {
        res.send({error: 'No board under that name exists'});
      }
    });
  })
  
  // works WORKS WORKS
  // POST
  .post(function(req, res) {
    let board = req.params.board;
    let thread = req.body.thread_id
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    
    let dataObject = {
      _id: new ObjectId(),
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
          
          if (result) {
            
          collection.findOneAndUpdate(
            {_id: ObjectId(thread)},
            { $addToSet: {replies: dataObject}, $inc: {replycount: 1}, $set: {bumped_on: new Date()} },
            function(err, result) {
              /* tests that bumped_on was changed for thread
              collection.findOne({_id: ObjectId(thread)}, function(err, result) {
                console.log(result);
              });
              */
              res.redirect('/b/' + board + '/' + thread);
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
  // works
  .delete(function(req, res) {
    console.log(req.body.thread_id);
    let board = req.params.board;
    let thread = req.body.thread_id;
    let reply_id = req.body.reply_id;
    let password = req.body.delete_password;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(board)) {
        res.send('No message board under that title');
      } else {
        let collection = dbo.collection(board);
        
        collection.findOne({'replies._id': ObjectId(reply_id), delete_password: password}, function(err, data) {
          
          if (data) {
            collection.updateOne(
              { _id: ObjectId(thread) },
              { $pull: { 'replies': { _id: ObjectId(reply_id) } }, $set: { bumped_on: new Date() }, $inc: { replycount: -1 } }
            );
            res.send('success');
          } else {
            res.send('incorrect password');
          }
          
        })
      }
    });
    
  })
  

};
