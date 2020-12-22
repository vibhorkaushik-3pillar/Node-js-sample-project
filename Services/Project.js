const Responses = require('./API_Responses');
const AWS = require('aws-sdk');
const utils = require('../Utils/utils');

const ProjectService = {};

/**
 * Get project detail
 * @param {string} projectName - to get detail
 * @return {object} - The project object
 */
ProjectService.GetProject = async (projectName) => {
    if (!projectName) {
        return Responses._400({ message: 'Project Name is missing in request' });
    }
    if (projectName) {
        const dynamodb = new AWS.DynamoDB.DocumentClient()
        return await dynamodb
            .scan({
                TableName: 'Projects',
                FilterExpression: 'contains(projectName, :projectName)',
                ExpressionAttributeValues: {
                    ':projectName': projectName.toLowerCase()
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

/**
 * Add new project
 * @param {string} projectName - name of project
 * @return {status} - 200,400,500
 */
ProjectService.AddProject = async (projectName) => {

    var dynamodb = new AWS.DynamoDB().DocumentClient();
    var params = {
        TableName: "Projects",
        Item: {
            id: { S: utils.getGUID() },
            projectName: { S: projectName.toLowerCase() },
            createdOn: { S: Date.now().toString() }
        }
    };

    return dynamodb.put(params)
        .promise()
        .then(data => {
            return Responses._200({ message: "Project Created" });
        })
        .catch(error => {
            return Responses._500({ message: "Unable to create project. Error JSON:", response: JSON.stringify(err, null, 2) })
        });
}

/**
 * Delete project
 * @param {Number} projectId - project Id
 * @param {string} projectName - name of project
 * @return {status} - 200,400,500
 */
ProjectService.DeleteProject = async (projectId, projectName) => {

    var dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "Projects",
        Key: {
            id: projectId,
            projectName: projectName
        }
    };

    return dynamodb.delete(params)
        .promise()
        .then(data => {
            return Responses._200({ message: "Project Deleted" });
        })
        .catch(error => {
            return Responses._500({ message: "Unable to delete project. Error JSON:", response: JSON.stringify(err, null, 2) })
        });
}

module.exports = ProjectService;