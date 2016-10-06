// var request = require('request')
// var config = require('./config')
var amsLogin = require('./amsAuth');
var elearningLogin = require('./elearningAuth');

module.exports = {
  aLogin : amsLogin,
  eLogin: elearningLogin
}
