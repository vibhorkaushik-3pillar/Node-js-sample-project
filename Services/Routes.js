const Responses = require('./API_Responses');
const AWS = require('aws-sdk');
const utils = require('../Utils/utils');

const RoutesService = {};

/**
 * Add new routes for project
 * @param {Number} projectId - project Id
 * @param {string} RoutesJson - json for routes
 * @return {status} - 200,400,500
 */
RoutesService.AddRoutes = async (projectId, RoutesJson) => {

    var dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "Routes",
        Item: {
            id: utils.getGUID(),
            projectId: projectId.toString(),
            Routes: RoutesJson.toString(),
            createdOn: Date.now().toString()
        }
    };

    return dynamodb.put(params)
        .promise()
        .then(data => {
            return Responses._200({ message: "Routes Created" });
        })
        .catch(error => {
            return Responses._500({ message: "Unable to create routes. Error JSON:", response: JSON.stringify(error, null, 2) })
        });
}

/**
 * get routes for project
 * @param {Number} projectId - project Id
 * @return {object} - routes object
 */
RoutesService.GetRoutes = async (projectId) => {
    if (!projectId) {
        return Responses._400({ message: 'Project Id is missing in request' });
    }
    if (projectId) {
        const dynamodb = new AWS.DynamoDB.DocumentClient()
        return await dynamodb
            .scan({
                TableName: 'Routes',
                FilterExpression: 'contains(projectId, :projectId)',
                ExpressionAttributeValues: {
                    ':projectId': projectId
                }
            })
            .promise()
            .then(data => {
                return (Responses._200(data.Items.length ? { response: data.Items[0] } : { message: "No project found" }))
            })
            .catch(error => {
                return (Responses._500({ message: 'Something went wrong.', error: error }));
            });
    }
}


module.exports = RoutesService;