const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1",
    endpoint: "http://dynamodb.ap-south-1.amazonaws.com"
  });
  
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "Inventory";
  
  module.exports.createProduct = (req)=>{
    
  }