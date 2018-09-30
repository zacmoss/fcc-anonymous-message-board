/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app) {
  
  app.route('/api/threads/:board');
  
  // post text and delete_password
  
  // res.redirect to /b/{board}
  // save _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on),
  // reported(boolean), delete_password, replies(array)
    
  app.route('/api/replies/:board');

};
