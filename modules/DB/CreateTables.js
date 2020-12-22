const Responses = require('../../Services/API_Responses');
const AWS = require('aws-sdk');

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.key) {
        return Responses._400({ message: 'Key is missing in request' });
    }

    let createdTable = event.pathParameters.key;
    if (createdTable === 'createTable') {

        const tables = await retrieveDBTables();
        var dynamodb = new AWS.DynamoDB();
        TableSchema.forEach(tableSchema => {
            if (!tables.includes(tableSchema.TableName)) {

                return dynamodb.createTable(tableSchema)
                    .promise()
                    .then((data) => {
                        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                    })
                    .catch(error => {
                        console.log("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    })
            }

        });

    }

}

retrieveDBTables = async () => {
    var dynamodb = new AWS.DynamoDB();
    return dynamodb.listTables({ Limit: 50 })
        .promise()
        .then((data) => {
            return data.TableNames;
        })
        .catch(error => {
            return (Responses._500("Unable to retrieve tables. Error JSON:", JSON.stringify(error, null, 2)));
        })
}

const TableSchema = [
    {
        TableName: "Projects",
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },  //Partition key
            { AttributeName: "projectName", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "projectName", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    },
    {
        TableName: "Routes",
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }
]

