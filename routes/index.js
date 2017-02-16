var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'My App', user: req.session && req.session.key ? req.session.key : ''});
});

router.get('/logout', function (req, res) {
    if (req.session && req.session.key) {
        req.session.destroy(function () {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
