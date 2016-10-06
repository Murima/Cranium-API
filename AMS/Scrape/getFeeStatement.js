var request = require('request')
var cheerio = require('cheerio')
var config = require('./config')

module.exports = function(auth) {
    return new Promise((resolve, reject) => {
        request({
            url: config.feeStatement + ";" + auth,
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
                    servletData: {
                        library: {},
                        payments: {}
                    }
                }
                // Library Charges
            var itemOnLoan = $('table#tblLibCharges.table').find('td.subhead').eq(0).next().text()
            var libraryCharges = $('table#tblLibCharges.table').find('td.subhead').eq(1).next().text()
            if (itemOnLoan) {
                data.servletData.library.itemsOnLoan = itemOnLoan
            } else {
                data.servletData.library.itemsOnLoan = "None"
            }
            if (libraryCharges) {
                data.servletData.library.libraryCharges = libraryCharges
            } else {
                data.servletData.library.libraryCharges = "None"
            }
            // Actual payment breakdown
            $('div#content').find('tr.table-row').each(function() {
                var date = $(this).find('td').eq(0).text()
                var documentNumber = $(this).find('td').eq(1).text()
                var documentType = $(this).find('td').eq(2).text()
                var debit = $(this).find('td').eq(3).text()
                var credit = $(this).find('td').eq(4).text()
                data.servletData.payments[documentNumber] = {
                    date: date,
                    documentType: documentType,
                    debit: debit,
                    credit: credit
                }
            })
            var totalDebit = $('div#sectionTotals').find('td.bold').eq(0).next().text()
            var totalCredit = $('div#sectionTotals').find('td.bold').eq(0).next().next().text()
            var balance = $('div#sectionTotals').find('td.bold').eq(4).text()
            data.servletData.totalDebit = totalDebit
            data.servletData.totalCredit = totalCredit
            data.servletData.balance = balance
            resolve(data);
        })

    })
}
