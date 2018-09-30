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
    
  app.route('/api/replies/:board');

};
