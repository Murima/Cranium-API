var express = require('express');
var router = express.Router();
var api = require('../../AMS/main.js')

// Get handlers
router.get('/', function(req, res, next) {
    res.render('api')
});

router.get('/getMarks', (req, res, next)=> {
  api(2).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
})

router.get('/getAttendance', (req, res, next)=> {
  api(1).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
})

router.get('/getProgressReport', (req, res, next)=> {
  api(0).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
})

router.get('/getFeeStatement', (req, res, next)=> {
  api(4).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
})

router.get('/getFeeStructure', (req, res, next)=> {
  api(3).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
})

// Post handlers
// router.post('/getAttendance', (req, res, next)=> {
//   api(1, req.body.studentNumber, req.body.password).then((result)=> {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(result)
//   })
//   console.log("username : " + req.body.studentNumber + " password : " + req.body.password);
//   // res.send("It worked baby!")
// })
//
// router.post('/getProgressReport', (req, res, next)=> {
//   api(0).then((result)=> {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(result)
//   })
// })
//
// router.post('/getFeeStatement', (req, res, next)=> {
//   api(4).then((result)=> {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(result)
//   })
// })
//
// router.post('/getFeeStructure', (req, res, next)=> {
//   api(3).then((result)=> {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(result)
//   })
// })

router.post('/devGeneric', (req, res, next)=> {
  api(returnIndexes(req.body.requests), req.body.studentNumber, req.body.password).then((result)=> {
      res.setHeader('Content-Type', 'application/json');
      res.send(result)
  })
  // console.log(req.body);
})

var returnIndexes = function(requestObject) {
  var indexes = []
  for (let request of requestObject) {
    indexes.push(getRoute(request))
  }
  if (indexes.indexOf("All") > -1) {
    return "All"
} else {
    return indexes
}
}

var getRoute = function(param) {
  var option
  switch(param) {
    case "Coursework Marks":
      option = 2;
      break;
    case "Attendance":
      option = 1;
      break;
    case "Fee Structure":
      option = 3;
      break;
    case "Fee Statement":
      option = 4;
      break;
    case "Progress Report":
      option = 0;
      break;
    case "Agregation":
      option = "All";
      break;
  }
  return option;
}

module.exports = router;
