var cheerio = require('cheerio')
var request = require('request')
var config = require('./config')

module.exports = function(auth) {
    return new Promise((resolve, reject) => {
        request({
            url: config.progressReport + ";" + auth,
            method: "GET",
            headers: {
                "User-Agent": config.userAgent
            }
        }, (err, res, body) => {
            var $ = cheerio.load(body)
            var servlet = $('h1.heading').text()
            var intakeYear = $('span#paramSyllabus').text()
            var academicYear = $('span#paramCursoAcademico').text()
            var data = {
                servlet: servlet,
                servletData: {
                    averages: {},
                    minReqCredits: {},
                    completedUnits: {},
                    compulsoryUnits: {},
                    specializationUnits: {},
                    exemptions: {}
                }
            }
            data.servletData.averages = {
                completedUnits: $('div#sectionAverages').find('td.subhead').eq(0).next().text(),
                averageMark: $('div#sectionAverages').find('td.subhead').eq(2).next().text(),
                totalMarks: $('div#sectionAverages').find('td.subhead').eq(1).next().text(),
                averageGrade: $('div#sectionAverages').find('td.subhead').eq(3).next().text(),
                specialization: $('div#sectionAverages').find('td.subhead').eq(4).next().text()
            }

            data.servletData.minReqCredits = {
                totalCredits: $('div#sectionSyllabusCredits').find('td.subhead').eq(0).next().text(),
                compulsoryCredits: $('div#sectionSyllabusCredits').find('td.subhead').eq(1).next().text()
            }

            var completedUnits = {}
            $('#sectionList').find('tr.table-row').each(function() {
                var unitCount = $(this).find('td').eq(0).text()
                if (unitCount == "Totals") {
                    completedUnits.totals = $(this).find('td').eq(0).next().text()
                    return
                }
                var subjectName = $(this).find('td').eq(5).text()
                completedUnits[subjectName] = {
                    academicYear: $(this).find('td').eq(1).text(),
                    syllabus: $(this).find('td').eq(2).text(),
                    Year: $(this).find('td').eq(3).text(),
                    subjectCode: $(this).find('td').eq(4).text(),
                    type: $(this).find('td').eq(6).text(),
                    marks: $(this).find('td').eq(7).text(),
                    grade: $(this).find('td').eq(8).text(),
                    credits: $(this).find('td').eq(9).text(),
                    gpv: $(this).find('td').eq(10).text()
                }
            })
            data.servletData.completedUnits = completedUnits

            var pendingUnits = {}
            $('table#tblPending').find('tr.table-row').each(function() {
                var unitCount = $(this).find('td').eq(0).text()
                if (unitCount == "Totals") {
                    pendingUnits.totals = $(this).find('td').eq(0).next().text()
                    return
                }
                var subjectName = $(this).find('td').eq(3).text()
                pendingUnits[subjectName] = {
                    academicYear: $(this).find('td').eq(1).text(),
                    subjectCode: $(this).find('td').eq(2).text(),
                    type: $(this).find('td').eq(4).text(),
                    creditHours: $(this).find('td').eq(5).text(),
                    comments: $(this).find('td').eq(6).text()
                }
            })
            data.servletData.pendingUnits = pendingUnits
            var compulsoryUnits = {}
            $('#sectionIncompleteOb').eq(0).find('tr.table-row').each(function() {
                var unitCount = $(this).find('td').eq(0).text()
                if (unitCount == "Totals") {
                    compulsoryUnits.totals = $(this).find('td').eq(0).next().text()
                    return
                } else if (unitCount !== "Totals") {
                    var subjectName = $(this).find('td').eq(3).text()
                    compulsoryUnits[subjectName] = {
                        academicYear: $(this).find('td').eq(1).text(),
                        subjectCode: $(this).find('td').eq(2).text(),
                        type: $(this).find('td').eq(4).text(),
                        creditHours: $(this).find('td').eq(5).text(),
                    }
                }
            })

            data.servletData.compulsoryUnits = compulsoryUnits
            var exemptions = {}
            $('#divExemptions').find('tr.table-row').each(function() {
                var unitCount = $(this).find('td').eq(0).text()
                if (unitCount !== "Totals") {
                    subjectName = $(this).find('td').eq(3).text()
                    compulsoryUnits[subjectName] = {
                        academicYear: $(this).find('td').eq(1).text(),
                        subjectCode: $(this).find('td').eq(2).text(),
                        type: $(this).find('td').eq(4).text(),
                        creditHours: $(this).find('td').eq(5).text(),
                    }
                } else if (unitCount == "Totals") {
                    exemptions.totals = $(this).find('td').eq(0).next().text()
                    return
                }

            })
            data.servletData.exemptions = exemptions

            var specializationUnits = {}
            $('div#sectionIncompleteOb').eq(1).find('tr.table-row').each(function() {
                var unitCount = $(this).find('td').eq(0).text()
                if (unitCount !== "Totals") {
                    var subjectName = $(this).find('td').eq(3).text()
                    specializationUnits[subjectName] = {
                        academicYear: $(this).find('td').eq(1).text(),
                        subjectCode: $(this).find('td').eq(2).text(),
                        type: $(this).find('td').eq(4).text(),
                        creditHours: $(this).find('td').eq(5).text(),
                    }
                } else if (unitCount == "Totals") {
                    specializationUnits.totals = $(this).find('td').eq(0).next().text()
                    return
                }
            })
            data.servletData.specializationUnits = specializationUnits
            resolve(data);
        })
    })
}
