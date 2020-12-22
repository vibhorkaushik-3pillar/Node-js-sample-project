const AWS = require('aws-sdk');
const ProjectService = require('../../Services/Project');

exports.handler = async event => {
    return await ProjectService.DeleteProject(event.pathParameters.id, event.pathParameters.name)
}
