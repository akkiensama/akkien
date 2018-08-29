var express = require('express');
var router = express.Router();

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

var imageHash = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Voting Dapp',
    hash: imageHash
  });
});

router.get('/clearhash', function(req, res, next) {
  imageHash = '';

  res.location('/');
  res.redirect('/');
});

router.post('/newimage', function(req, res, next) {
  if(req.file){
    ipfs.add(req.file.buffer, (err, ipfsHash) => {
      if(err) {
        console.log('error', err);

        res.location('/');
        res.redirect(420, '/');
      } else {
        console.log('hash', ipfsHash[0].hash );

        if(imageHash == '') {
          imageHash += ipfsHash[0].hash;
        } else {
          imageHash += ',' + ipfsHash[0].hash;
        }
        res.location('/');
        res.redirect('/');
      }
    });  
  } else {
    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
