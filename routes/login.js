var express = require('express');

var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'Login', error: ''});
});

/* POST login form */
router.post('/', db.loginUser);

module.exports = router;
