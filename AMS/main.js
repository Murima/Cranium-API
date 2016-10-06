var getMarks = require('./Scrape/getMarks')
var getProgress = require('./Scrape/getProgressReport')
var getAttendance = require('./Scrape/getAttendance')
var getFeeStructure = require('./Scrape/getFeeStructure')
var getFeeStatement = require('./Scrape/getFeeStatement')
var auth = require('../Auth/main')


module.exports = (indexes, username, password) => {
    return new Promise((resolve, reject) => {
        auth.aLogin(username, password).then(function(auth) {
            Promise.all([
                getProgress(auth),
                getAttendance(auth),
                getMarks(auth),
                getFeeStructure(auth),
                getFeeStatement(auth)
            ]).then((values) => {
              console.log("Debug 1: " + indexes);
                if (indexes == "All") {
                  resolve(values)
                } else {
                  var dataSet = {}
                  for (let index of indexes) {
                    var servlet = values[index].servlet
                    dataSet[servlet] = values[index]
                  }
                  resolve(dataSet)
                }
            })
        }).catch((err) => {
            reject(err)
        })
    })
}
