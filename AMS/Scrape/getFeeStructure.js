var request = require('request')
var cheerio = require('cheerio')
var config = require('./config')

module.exports = function(auth) {
    return new Promise((resolve, reject) => {
        request({
            url: config.feeStructure + ";" + auth,
            method: "get",
            headers: {
                "User-Agent": config.userAgent
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            var $ = cheerio.load(body)
            var servlet = $('h1.heading').text()
            var data = {
                servlet: servlet,
                // intakeYear: intakeYear,
                // academicYear: academicYear,
                servletData: {
                    feeStructures: {
                        "Year 1": "",
                        "Year 2": "",
                        "Year 3": ""
                    }
                }
            }
            var semester = $('table#tblExamCards.table').find('span').eq(0).text()
            var startDate = $('table#tblExamCards.table').find('span').eq(1).text()
            var endDate = $('table#tblExamCards.table').find('span').eq(2).text()
            data.servletData.semester = semester
            data.servletData.startDate = startDate
            data.servletData.endDate = endDate

            $('table#tblExamCards').find('tr.table-row').each(function(i, elem) {
                if ($(this).find('td').length == 2) {
                    var studentYear = "Year " + $(this).find('td').eq(0).text()
                    var downloadUrl = $(this).find('a').attr('href')
                    data.servletData.feeStructures[studentYear] = downloadUrl
                }
            })
            resolve(data);
        })
    })
}
