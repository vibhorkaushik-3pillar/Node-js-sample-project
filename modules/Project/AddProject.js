const Responses = require('../../Services/API_Responses');
const AWS = require('aws-sdk');

const ProjectService = require('../../Services/Project');

exports.handler = async event => {
    if (!event.pathParameters || !event.pathParameters.name) {
        return Responses._400({ message: 'Project Name is missing in request' });
    }

    let projectName = event.pathParameters.name;
    if (projectName) {

        const project = await ProjectService.GetProject(projectName);
        if (project && project.body && JSON.parse(project.body).response && JSON.parse(project.body).response.id) {
            return Responses._400({ message: "project with same name already exist" });
        } else {
            return await ProjectService.AddProject(projectName);
        }
    }

    //failed as id not found
    return Responses._500({ message: 'Something went wrong.' });
}
