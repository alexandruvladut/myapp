var express = require('express');

var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register', {title: 'Register', error: '', user: ''});
});

/* POST login form */
router.post('/', db.createUser);

module.exports = router;
