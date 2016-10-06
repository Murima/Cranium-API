var request = require('request')
var config = require('./config')

module.exports = function(username, password) {
    return new Promise(function(resolve, reject) {
        request({
            url: config.loginUrl,
            method: "GET",
            headers: config.getHeaders
        }, function(err, res, body) {
            if (err) return reject(err)
            var jsessionid = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
            var postUrl = config.path + "jsessionid=" + jsessionid + config.service
            config.formData.username = username
            config.formData.password = password
            request({
                url: postUrl,
                method: "POST",
                headers: config.postHeaders,
                form: config.formData
            }, function(err, res, body) {
                if (err) return reject(err)
                var authLocation = res.headers.location
                request({
                    url: authLocation,
                    method: "GET",
                    headers: config.getHeaders
                }, function(err, res, body) {
                    if (err) return reject(err)
                    var authID = res.request.uri.path.split(';')[1]
                    resolve(authID);
                })
            })
        })
    })
}
