var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Voting Dapp' 
  });
});

router.post('/newimage', function(req, res, next) {
  
  console.log("file: " + req.file + "\nfiles: " + req.files + "\nfiles.mainimage: " + req.files.avatar);


  res.location('/');
  res.redirect('/');
});

module.exports = router;
