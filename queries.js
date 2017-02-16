var config = require('./config/environment');

var pgp = require('pg-promise')({
    // Initialization Options
});
var db = pgp(config.connection.postgres);

function createUser(req, res, next) {
    var name = req.body.username,
        pass = req.body.password,
        repass = req.body.repassword,
        fname = req.body.firstname,
        lname = req.body.lastname,
        phone = req.body.phone,
        email = req.body.email;

    var errMsg = '';
    if (!name) {
        errMsg = 'Username is required!';
    } else if (!pass) {
        errMsg = 'Password is required!';
    } else if (!repass) {
        errMsg = 'Repeat password is required!';
    } else if (pass != repass) {
        errMsg = 'Passwords do not match!';
    } else if (!email) {
        errMsg = 'Email is required!';
    }

    if (errMsg) {
        return res.render('register', {title: 'Registration error', error: errMsg, user: ''});
    }

    var user = {
        username: name,
        password: pass,
        first_name: fname,
        last_name: lname,
        phone: phone,
        email: email,
        created: new Date()
    };

    db.one("select * from users where username=$1", user.username)
        .then(function (user) {
            console.log(user); // print user object;

            return res.render('register', {title: 'Registration error', error: 'Username already exists!', user: ''});
        })
        .catch(function (error) {
            // error;
            console.log(error);
            if (error && !error.received) {
                addUser(user);
            }
        });


    function addUser(user) {
        db.one(" insert into users(username, password, first_name, last_name, phone, email, created) " +
                " values(${username}, md5(${password}), ${first_name}, ${last_name}, ${phone}, ${email}, ${created}) RETURNING * ", user)
            .then(function (data) {
                console.log('User id:' + data.id); // print new user id;
                res.render('register', {title: 'Registration successful', error: '', user: data.username});
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error); // print error;
                res.render('register', {title: 'Registration error', error: 'Error creating account!', user: ''});
            });
    }
}

function loginUser(req, res, next) {
    var name = req.body.username, pass = req.body.password;
    db.one("select * from users where username=$1 and password=md5($2)", [name, pass])
        .then(function (user) {
            req.session.key = user.username;
            res.redirect('/');
        })
        .catch(function (error) {
            // error;
            console.log(error);
            if (error && !error.received) {
                res.render('login', {title: 'Login', error: 'Invalid username or password!'});
            }
        });
}

function getAllUsers(req, res, next) {
    db.any("select * from users")
        .then(function (data) {
            console.log(data);
            //res.json(data);
            res.render('users', {title: 'Users', users: data, error: ''});
        })
        .catch(function (error) {
            // error;
            console.log(error);
            //res.status(500).json({error: error});
            res.render('users', {title: 'Users', users: [], error: error});
        });
}

function getProjectsByUsername(req, res, next) {
    db.any("SELECT p.id, p.name, p.description, p.status, p.created, p.updated " +
            " FROM users AS u " +
            " INNER JOIN users_projects AS up ON u.id = up.fk_users " +
            " INNER JOIN projects AS p ON p.id = up.fk_projects " +
            " WHERE u.username = $1", req.session.key)
        .then(function (data) {
            //res.json(data);
            res.render('projects', {title: 'Projects', projects: data, error: ''});
        })
        .catch(function (error) {
            // error;
            console.log(error);
            //res.status(500).json({error: error});
            res.render('projects', {title: 'Projects', projects: [], error: error});
        });
}

function getAllProjects(callback) {
    db.any("SELECT p.id, p.name, p.description, p.status, p.created, p.updated " +
            " FROM users AS u " +
            " INNER JOIN users_projects AS up ON u.id = up.fk_users " +
            " INNER JOIN projects AS p ON p.id = up.fk_projects ")
        .then(function (data) {
            return callback(data);
        })
        .catch(function (error) {
            // error;
            console.log(error);
            return callback(null);
        });
}

function getProjectById(req, res, next) {
    var id = req.params.id;
    console.log(id);
    db.one("SELECT p.id, p.name, p.description, p.status, p.created, p.updated " +
            " FROM users AS u " +
            " INNER JOIN users_projects AS up ON u.id = up.fk_users " +
            " INNER JOIN projects AS p ON p.id = up.fk_projects " +
            " WHERE u.username = $1 AND p.id = $2", [req.session.key, id])
        .then(function (data) {
            res.render('edit-project', {title: 'Edit project', project: data, error: ''});
        })
        .catch(function (error) {
            // error;
            console.log(error);
            //res.status(500).json({error: error});
            res.render('edit-project', {title: 'Edit project', project: {}, error: error});
        });
}

function createProject(req, res, next) {
    var name = req.body.name,
        description = req.body.description,
        status = req.body.status;

    var errMsg = '';
    if (!name) {
        errMsg = 'Name is required!';
    } else if (!status) {
        errMsg = 'Status is required!';
    }

    if (errMsg) {
        return res.json({error: errMsg});
    }

    var project = {
        name: name,
        description: description,
        status: status,
        created: new Date()
    };

    db.one("SELECT p.id, p.name, p.description, p.status, p.created, p.updated " +
            " FROM users AS u " +
            " INNER JOIN users_projects AS up ON u.id = up.fk_users " +
            " INNER JOIN projects AS p ON p.id = up.fk_projects " +
            " WHERE u.username = $1 AND p.name = $2", [req.session.key, project.name])
        .then(function (project) {
            console.log(project); // print user object;

            return res.json({error: 'Project already exists!'});
        })
        .catch(function (error) {
            // error;
            console.log(error);
            if (error && !error.received) {
                addProject(project);
            }
        });


    function addProject(project) {
        db.one(" insert into projects(name, description, status, created) " +
                " values(${name}, ${description}, ${status}, ${created}) RETURNING * ", project)
            .then(function (data) {
                console.log('Project id:' + data.id);
                var projId = data.id;
                db.one(" insert into users_projects(fk_users, fk_projects) " +
                        " values((select id from users where username = $1), $2) RETURNING id ", [req.session.key, projId])
                    .then(function (data2) {
                        console.log('UserProjects id:' + data2.id);
                        res.json({
                            project: data.name
                        });
                    })
                    .catch(function (error) {
                        console.log("ERROR USER_PROJECTS:", error.message || error);
                        res.json({
                            error: 'Error creating project!'
                        });
                    });
            })
            .catch(function (error) {
                console.log("ERROR PROJECTS:", error.message || error); // print error;
                res.json({
                    error: 'Error creating project!'
                });
            });
    }
}

function modifyProject(jsonProject, callback) {
    var name = jsonProject.name,
        description = jsonProject.description,
        id = jsonProject.id,
        status = jsonProject.status;

    var errMsg = '';
    if (!name) {
        errMsg = 'Name is required!';
    } else if (!status) {
        errMsg = 'Status is required!';
    }

    if (errMsg) {
        return res.json({error: errMsg});
    }

    var project = {
        id: id,
        name: name,
        description: description,
        status: status,
        updated: new Date()
    };

    db.one("SELECT id from projects " +
            " WHERE id = $1", project.id)
        .then(function (result) {
            console.log(result); // print user object;

            updateProject(project, function (data) {
                return callback(data);
            });
        })
        .catch(function (error) {
            // error;
            console.log(error);
            if (error && !error.received) {
                return callback(null);
            }
        });


    function updateProject(project, callback) {
        db.one(" update projects " +
                " set name = ${name}, description = ${description}, status = ${status}, updated = ${updated} " +
                " where id = ${id} " +
                " RETURNING * ", project)
            .then(function (data) {
                console.log('Project id:' + data.id);
                return callback(data);
            })
            .catch(function (error) {
                console.log("ERROR PROJECTS:", error.message || error); // print error;
                return callback(null);
            });
    }
}

function removeProject(req, res, next) {
    var projID = parseInt(req.body.id);

    db.result('delete from users_projects where fk_projects = $1', projID)
        .then(function (result) {
            db.result('delete from projects where id = $1', projID)
                .then(function (result) {
                    res.send(result);
                })
                .catch(function (err) {
                    return next(err);
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    createUser: createUser,
    loginUser: loginUser,
    getAllUsers: getAllUsers,
    createProject: createProject,
    removeProject: removeProject,
    modifyProject: modifyProject,
    getProjectsByUsername: getProjectsByUsername,
    getProjectById: getProjectById,
    getAllProjects: getAllProjects
}