const AWS = require('aws-sdk');
const RoutesService = require('../../Services/Routes');

exports.handler = async event => {
    return await RoutesService.GetRoutes(event.pathParameters.projectId)
}
