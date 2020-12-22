const ProjectService = require('../../Services/Project');

exports.handler = async event => {
    return await ProjectService.GetProject(event.pathParameters.name)
}
