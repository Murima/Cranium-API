var cheerio = require('cheerio')
var request = require('request')
var config = require('./config')

module.exports = function(auth) {
  return new Promise( (resolve, reject) => {
    request({
        url: config.attendance + ";" + auth,
        method: "get",
        headers: {
            "User-Agent": config.userAgent
        }
    }, function(err, res, body) {
        if (err) return reject(err)
        var $ = cheerio.load(body)
        var servlet = $('h1.heading').text()
        var intakeYear = $('span#paramSyllabus').text()
        var academicYear = $('span#paramCursoAcademico').text()
        var data = {
            servlet: servlet,
            intakeYear: intakeYear,
            academicYear: academicYear,
            servletData: {}
        }
        $('tr.table-row').each(function() {
            var name = $(this).find('td').eq(1).text()
            data.servletData[name] = {
                subjectCode: $(this).find('td').eq(0).text(),
                group: $(this).find('td').eq(2).text(),
                period: $(this).find('td').eq(3).text(),
                lecturer: $(this).find('td').eq(4).text(),
                totalHours: $(this).find('td').eq(5).text(),
                absentClasses: $(this).find('td').eq(6).text(),
                absentHours: $(this).find('td').eq(7).text(),
                percentAbsent: $(this).find('td').eq(8).text()
            }
        })
        resolve(data)
    })
  }
)}
