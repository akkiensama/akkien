var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:address', function(req, res, next) {
  res.render('ballot', {
      title: 'Voting Dapp',
      address: req.params.address
  });
});

module.exports = router;
