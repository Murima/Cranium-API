var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cranium' });
});

router.get('/contribute', ((req, res, next)=>{
  res.render('contribute');
}));
module.exports = router;
