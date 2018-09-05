var express = require('express');
var router = express.Router();

var imageHash = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Voting Dapp'
  });
});

module.exports = router;
