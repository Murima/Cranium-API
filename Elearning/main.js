var auth = require('../Auth/main');
var dashboard  = require('./Scrape/dashboard');



// module.exports = (indexes, username, password) => {
//     return new Promise((resolve, reject) => {
//         auth.eLogin(username, password).then(function(auth) {
//             Promise.all([
//                 getProgress(auth),
//                 getAttendance(auth),
//                 getMarks(auth),
//                 getFeeStructure(auth),
//                 getFeeStatement(auth)
//             ]).then((values) => {
//               console.log("Debug 1: " + indexes);
//                 if (indexes == "All") {
//                   resolve(values)
//                 } else {
//                   var dataSet = {}
//                   for (let index of indexes) {
//                     var servlet = values[index].servlet
//                     dataSet[servlet] = values[index]
//                   }
//                   resolve(dataSet)
//                 }
//             })
//         }).catch((err) => {
//             reject(err)
//         })
//     })
// }

auth.eLogin("87469", "anaminyiamanda").then(function(auth){
  dashboard(auth);
});
