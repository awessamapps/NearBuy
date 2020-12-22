const AWS = require('aws-sdk');
const microtime = require('microtime');
const NodeCache = require( "node-cache" );

const cache = new NodeCache()

const CACHE_ALL_CATEGORIES = "all_categories";

const BUCKET_NAME = "myawsbucket123841";

AWS.config.update({
    region: "ap-south-1"
    //endpoint: "http://dynamodb.ap-south-1.amazonaws.com"
});


const S3Bucket = new AWS.S3({
    signatureVersion: 'v4',
    params: { Bucket: BUCKET_NAME },
  });


  module.exports.getSignedUrlForImage = function(location){
    return new Promise((resolve, reject)=>{

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${location}/categories/dp/${microtime.now()}.jpg`,
            Expires: 15 * 60, // 15 minutes
            ACL: 'public-read',
          };

          S3Bucket.getSignedUrl("putObject", params, (err, url)=>{
              if (err){
                  reject(error);
                  return;
              }

              resolve(url);
          });


    })
  }



  module.exports.getCategory = function(location, fromCache){

    return new Promise(function(resolve, reject){

      if (fromCache){

        const data = cache.get(CACHE_ALL_CATEGORIES);

        if (data){
          data.from_cache = true;
          resolve(data);
          return;
        }
    
      }

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${location}/categories/index.json`
          };

          S3Bucket.getObject(params, function(error, data){
              if (error){
                  reject(error);
                  return;
              }
              cache.set(CACHE_ALL_CATEGORIES, data, 3600);
              resolve(data);
          })
    })
  }
  module.exports.putCategory = function(location, data){

    return new Promise(function(resolve, reject){

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${location}/categories/index.json`,
            Body : JSON.stringify( data)
          };
    
          S3Bucket.putObject(params, function(error, data) {

            if (error){
                reject(error);
                return;
            }
            resolve(data);
        });


    })
    

  }