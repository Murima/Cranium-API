var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');
var fs = require('fs');

var dashboard = function(auth) {
    // Grab dashboard page body using auth
    config.headers.Cookie = auth;
    request({
            url: config.e_Courses,
            method: "GET",
            headers: config.headers
        },
        // Dashboard scraping starts here
        function(err, res, body) {
            if (err) {
                console.log("Debug line 16 dashboard.js : " + err);
                reject(err);
            }
            var $ = cheerio.load(body);
            var dashboard = {};
            // Grab course names and associated urls
            var count = 0;
            $('div.box.coursebox').each(function() {
                var courseName = $(this).find('h2').text();
                var courseUrl = $(this).find('h2').find('a').attr('href');
                dashboard[count] = {
                    course: courseName,
                    url: courseUrl
                }
                var notices = $(this).find('div.assign.overview')
                var turnitIn = $(this).find('.turnitintool.overview');
                if (turnitIn.length > 0) {
                    dashboard[count].notifications = turnitIn.text();
                }
                if (notices.length > 0) {
                    notices.each(function() {
                        var notice = $(this).text();
                        dashboard[count].notifications = notice;
                    })
                }
                count++;
            })
            // populateCourse(dashboard, auth);
            // console.log(dashboard);
            Object.keys(dashboard).forEach((key) => {
                var coursesUrl = dashboard[key].url
                request({
                    url: coursesUrl,
                    method: "GET",
                    headers: config.headers
                }, function(err, res, body) {
                    var dataSet = {}
                    var $ = cheerio.load(body);
                    var topics = $('ul.topics').children()
                    if (!topics.length) topics = $('ul.weeks').children()
                    topics.each(function(index, item) {
                        var topicLabel = $(this).attr('aria-label');
                        if ($(this).children().length) {
                            var content = $(this).find('div.content'); //pivoting
                            var summary = content.find('.summary').html()
                            var data = content.find('ul.section.img-text').children()
                            var topic = "Topic " + index
                            if (data.length) {
                                dataSet[topic] = {
                                    topicName: topicLabel,
                                }
                            } else {
                              return;
                            }
                            if (summary) {
                                dataSet[topic].summary = summary;
                            } else {
                                dataSet[topic].summary = null;
                            }
                            // console.log(topicLabel.trim());
                            data.each(function(i, item) {
                                var activity = $(this).find('.activityinstance');
                                // console.log(activity.length);
                                if (activity.length) {
                                    var href = activity.find('a').attr('href');
                                    var activityName = activity.find('span').first().contents().filter(function() {
                                        return this.type === 'text';
                                    }).text();
                                    var actPosition = "Activity " + i;
                                    if (!("activities" in dataSet[topic])) {
                                        dataSet[topic].activities = {};
                                    }
                                    dataSet[topic].activities[actPosition] = {
                                            title: activityName,
                                            url: href
                                        }
                                        // Get content after link
                                    var contentAL = activity.next().text();
                                    if (contentAL) {
                                        dataSet[topic].activities[actPosition].metaLinkData = contentAL;
                                    }
                                }
                                var contentWL = $(this).find('div.contentwithoutlink').html();
                                if (contentWL) {
                                    dataSet[topic].contentWL = contentWL;
                                }
                            })
                        }
                        dashboard[key].courseData = dataSet;
                        // console.log("Debug urgent : " + dashboard[key].courseData);
                        //  = dataSet;
                        console.log(JSON.stringify(dashboard, null, 2));
                    })
                });

            })
        })
}

// var populateCourse = function(dashboard, auth) {
    // config.headers.Cookie = auth;

    // return newDash;
// }

module.exports = dashboard
