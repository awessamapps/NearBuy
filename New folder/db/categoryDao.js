const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1"
    //endpoint: "http://dynamodb.ap-south-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "inventory";


module.exports.findChild = (req, primaryKey, active, projectionExpression) => {

    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#PK = :hkey",

            ExpressionAttributeNames: {
                '#PK': 'PK'
            },
            ExpressionAttributeValues: {
                ":hkey": primaryKey.partitionKey,
                ":t":active
            },
            ProjectionExpression: projectionExpression,
            FilterExpression : "active = :t"
        };
        docClient.query(params, function (err, data) {
            err ? reject(err) : resolve(data);
        });
    });
}

module.exports.ifExists = (req, primaryKey) => {

    return new Promise((resolve, reject) => {

        const params = {
            TableName: tableName,
            KeyConditionExpression: "#PK = :hkey and #SK = :skey",

            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK'
            },

            ExpressionAttributeValues: {
                ":hkey": primaryKey.partitionKey,
                ":skey": primaryKey.sortKey
            }
        };

        docClient.query(params, function (err, data) {
            err ? reject(err) : resolve(data);
        });

    })
}

module.exports.insert = (req, primaryKey) => {


    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: {
                "PK": primaryKey.partitionKey,
                "SK": primaryKey.sortKey,
                "user_inserted": req.body.username,
                "time_inserted": new Date() + "",
                "ip_address_inserted": req.appParams.ip,
                "active": true
            }
        };
        docClient.put(params, (docErr) => {
            docErr ? reject(docErr) : resolve();
        });
    });





}