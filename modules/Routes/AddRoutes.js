const Responses = require('../../Services/API_Responses');
const RoutesService = require('../../Services/Routes');

exports.handler = async event => {
    if (!event.pathParameters || !event.pathParameters.projectId) {
        return Responses._400({ message: 'Project detail is missing in request' });
    }

    let projectId = event.pathParameters.projectId;
    if (projectId) {
        const response = await RoutesService.AddRoutes(projectId, event.body);
    }

    return Responses._500({ message: 'Something went wrong.' });
}
