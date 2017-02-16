var express = require('express');
var router = express.Router();
var config = require('../config/environment');

var db = require('../queries');
var soap = require('soap');

/* GET projects listing */
router.get('/', db.getProjectsByUsername);

router.get('/id/:id', db.getProjectById);

router.get('/new', function (req, res, next) {
    res.render('new-project', {title: 'Create new project', error: '', project: ''});
});

/* POST new project */
router.post('/save', db.createProject);

/* DELETE project*/
router.delete('/', db.removeProject);

/*UPDATE project via SOAP req*/
router.put('/', function (req, res, next) {
        var id = req.body.id;
        var name = req.body.name;
        var description = req.body.description;
        var status = req.body.status;

        if (!id) {
            return res.send({error: 'Invalid parameters'});
        }
        soap.createClient(config.wsdl.url, function (err, client) {
            if (err) throw err;
            //console.log(client.describe().ProjectService.ProjectServiceSOAP);
            client.PutProject({
                id: id,
                name: name,
                description: description,
                status: status
            }, function (err, data) {
                if (err) throw err;
                console.log(data);
                res.send(data);
            });
        })
    }
);
module.exports = router;
