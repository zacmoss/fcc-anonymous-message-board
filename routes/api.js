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
  
  app.route('/api/threads/:board');
  
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
              let dbo = db.db("fcc-cert6-project5");
              let collection = dbo.collection('messageBoard');
              collection.insertOne({key: 'value test'});
  });
  
  // GET thread
  
  
  // POST
  // post text and delete_password
  
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
