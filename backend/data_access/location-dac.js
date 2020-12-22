const AWS = require("aws-sdk");
const NodeCache = require( "node-cache" );

const cache = new NodeCache()

AWS.config.update({
    region: "ap-south-1"
    //endpoint: "http://dynamodb.ap-south-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const PARITION_KEY_PREFIX = "#LOCATION#ENTRY";
const TABLE_NAME = "inventory";
const ALL_LOCATIONS = "all_locations";




module.exports.isExists = function(locationName){

    return new Promise((resolve, reject)=>{

        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "#PK = :hkey and #SK= :skey",

            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK' : 'SK'
            },

            ExpressionAttributeValues: {
                ":hkey": PARITION_KEY_PREFIX,
                ":skey" : locationName
            }
        };

        docClient.query(params, function (err, data) {
            err ? reject(err) : resolve(data.Count);
        });
    })

}


module.exports.insert = function(insertData){

    return new Promise( function (resolve, reject){

        const params = {
            TableName: TABLE_NAME,
            Item: {
                "PK": PARITION_KEY_PREFIX,
                "SK": insertData.locationName,
                "date_inserted" : new Date() + "",
                "user_inserted": insertData.username,
                "ip_address_inserted": insertData.ipAddress,
                "active": insertData.active,
                "latitude" : insertData.latitude,
                "longitude" : insertData.longitude
            }
        };

        docClient.put(params, (docErr) => {
            docErr ? reject(docErr) : resolve(true);
        });

        
    } )
}


module.exports.findAll = function(fromCache){

    return new Promise( function(resolve, reject){

        if (fromCache){
           const data =  cache.get(ALL_LOCATIONS);

           if (data){
               data.from_cache = true;
              
               resolve(data);
               
               return;
           }
        }

        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "#PK = :hkey",

            ExpressionAttributeNames: {
                '#PK': 'PK'
            },

            ExpressionAttributeValues: {
                ":hkey": PARITION_KEY_PREFIX
            }
        };

        docClient.query(params, function (err, data) {

            if (err){
                reject(err)
            }
            else {
                
               cache.set(ALL_LOCATIONS, data, 3600);
                resolve(data);
            }
            
        });


    } )
}