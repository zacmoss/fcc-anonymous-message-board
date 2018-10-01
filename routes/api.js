/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  // GET thread
  
  app.route('/api/threads/:board')
    .get(function(req, res) {
      let messageBoard = req.params.board;
    
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project5");
        if (dbo.collection(messageBoard)) {
          let collection = dbo.collection(messageBoard);
        } else {
          res.send({error: 'No board under that name exists'});
        }
      });
                  

      /*
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
                  let dbo = db.db("fcc-cert6-project5");
                  if (!dbo.collection(messageBoard)) dbo.createCollection(messageBoard);
                  let collection = dbo.collection(messageBoard);
                  collection.insertOne({key: 'value test'});
      });
      */
    })
  
  
  // POST
  // post text and delete_password
  
  // board text delete_password
  
  .post(function(req, res) {
    let messageBoard = req.params.board;
    let board = req.query.board;
    let text = req.query.text;
    let delete_password = req.query.password;
    console.log(board);
    console.log(text);
    console.log(delete_password);
    /*
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
      let dbo = db.db("fcc-cert6-project5");
      if (!dbo.collection(messageBoard)) dbo.createCollection(messageBoard);
      let collection = dbo.collection(messageBoard);
      //collection.insertOne({key: 'value test'});
    });
    */
  })
  
  
  
  // res.redirect to /b/{board}
  // save _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on),
  // reported(boolean), delete_password, replies(array)
  
  // PUT
  
  // DELETE
    
  app.route('/api/replies/:board');
  
  // GET
  
  // POST
  
  // PUT
  
  // DELETE
  

};
