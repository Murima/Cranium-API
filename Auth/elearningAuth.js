var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');

module.exports = function(username, password) {
  return new Promise((resolve, reject)=> {
    request({
      url: config.e_IndexPage,
      method: "GET",
      headers : {
        "User-Agent": config.userAgent
      }
    }, function(err, res, body) {
      if (err) {
        console.log(err + "Log at line 16 elearningAuth.js");
        reject(err);
      }
      var cookieA = res.headers['set-cookie'][0];
      request({
        url: config.e_LoginUrl,
        method: "POST",
        headers: {
          "Cookie": cookieA,
          "User-Agent": config.userAgent
        },
        form: {
          username: username,
          password: password
        }
      }, function(err, res, body) {
        if (err) {
          console.log(err + "Log at line 30 elearningAuth.js");
          reject(err);
        }
        var cookieB = res.headers['set-cookie'][0].split(';')[0];
        resolve(cookieB);
        })
    });
  })
}
