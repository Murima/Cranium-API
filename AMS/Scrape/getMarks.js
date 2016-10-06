var cheerio = require('cheerio')
var request = require('request')
var config = require('./config')

module.exports = function(auth) {
    return new Promise((resolve, reject) => {
        request({
            url: config.marks + ";" + auth,
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
                    servletData: {
                        firstSemester: {},
                        secondSemester: {}
                    }
                }
                // First semester extraction
            $('div#sectionCoursework').eq(0).find('div#sectionAsignatura').each(function(i, elem) {
                    var subject = $(this).prev().find('span').eq(0).text().trim()
                    var avg = $(this).prev().find('span').eq(2).text().trim()
                    data.servletData.firstSemester[subject] = {}
                    $(this).find('tr').each(function(i, elem) {
                        var exam = $(this).find('td').eq(1).text().trim()
                        var mark = $(this).find('td').eq(2).text().trim()
                        data.servletData.firstSemester[subject][exam] = mark
                    })

                })
                // Second semester extraction
            $('div#sectionCoursework').eq(1).find('div#sectionAsignatura').each(function(i, elem) {
                var subject = $(this).prev().find('span').eq(0).text().trim()
                var avg = $(this).prev().find('span').eq(2).text().trim()
                data.servletData.secondSemester[subject] = {}
                $(this).find('tr').each(function(i, elem) {
                    var exam = $(this).find('td').eq(1).text().trim()
                    var mark = $(this).find('td').eq(2).text().trim()
                    data.servletData.secondSemester[subject][exam] = mark
                })
            })
            resolve(data)
        })
    })
}
