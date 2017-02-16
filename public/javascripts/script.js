function getProjects() {
    $.ajax({
        type: 'GET',
        url: '/projects',
        success: function (data) {
            $('#projects').html(data);
        }
    });
}
function getNewProject() {
    $.ajax({
        type: 'GET',
        url: '/projects/new',
        success: function (data) {
            $('#new-project').html(data);
        }
    });
}

function getUsers() {
    $.ajax({
        type: 'GET',
        url: '/users',
        success: function (data) {
            $('#users').html(data);
        }
    });
}

function removeProject(id) {
    $.ajax({
        type: 'DELETE',
        url: '/projects',
        data: {id: id},
        success: function (data) {
            console.log(data);
            getProjects();
        }
    });
}

