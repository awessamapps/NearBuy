const Router = require('express').Router();
const UserDao = require('../../../service/db/userDao')
const ResponseModels = require('../../../Utils/responseModels');
const DbPrimaryKeys = require('../../../Utils/dbPrimaryKeys')
const Joi = require('joi');
const CategoryDao = require('../../../service/db/categoryDao');


const AWS = require('aws-sdk');
const S3Bucket = new AWS.S3({
    signatureVersion: 'v4',
    params: { Bucket: "myawsbucket123841" },
  });

const schemaAddCategory = Joi.object().keys({
    username: Joi.string(),
    password: Joi.string(),
    location: Joi.string().trim().min(4).max(30).required(),
    child: Joi.string().trim().min(4).max(30).required()
});


// GET MAIN CATEGORIES IN LOCATION
Router.get('/', (req, res) => {

    

    req.body.location = req.restQueryParams.location;
    const primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location);
    CategoryDao.findChild(req, primaryKey, true, "SK")
    .then((data)=>{


        const params = {
            Bucket: "myawsbucket123841",
            Key: "img.jpg",
            Expires: 15 * 60, // 15 minutes
            ACL: 'public-read',
          };
    
          S3Bucket.getSignedUrl("putObject", params, (err, url)=>console.log(err || url));
    


        ResponseModels.simpleSuccess(res,"", formatItems( data));
    })
    .catch((reason)=> ResponseModels.simpleFail(res,"Failed to browse", reason.message));
});


// GET SUB CATEGORIES IN MAIN CATEGORY
Router.get('/:mainCategory', (req, res) => {

    req.body.location = req.restQueryParams.location;
    const primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, "", req.params.mainCategory);
    CategoryDao.findChild(req, primaryKey, true, "SK")
    .then((data)=>{
        ResponseModels.simpleSuccess(res,"", formatItems( data));
    })
    .catch((reason)=> ResponseModels.simpleFail(res,"Failed to browse", reason.message));
});

// GET SUB-SUB CATEGORIES IN SUB CATEGORY
Router.get('/:mainCategory/:subCategory', (req, res) => {

    req.body.location = req.restQueryParams.location;
    const primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, "", req.params.mainCategory, req.params.subCategory);
    CategoryDao.findChild(req, primaryKey, true, "SK")
    .then((data)=>{
        ResponseModels.simpleSuccess(res,"", formatItems( data));
    })
    .catch((reason)=> ResponseModels.simpleFail(res,"Failed to browse", reason.message));
});

//ADD MAIN CATEGORY INTO LOCATION
Router.put('/', (req, res) => {
    UserDao.verifyAdmin(req.body.username, req.body.password)
        .then(() => {
            req.body.location = req.restQueryParams.location;

            if (!validateSchema(req, res, schemaAddCategory))
                return;

            // TODO CHECK IF LOCATION EXISTS

            const primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, req.body.child);
            CategoryDao.insert(req, primaryKey)
                .then(() => ResponseModels.simpleSuccess(res, "Added new category", res.body))
                .catch((err) => ResponseModels.simpleFail(res, "Failed to add a new category", err.message));
        })
        .catch((err) => ResponseModels.rejectAuth(res, err.message));
});

//ADD SUB CATEGORY INTO MAIN CATEGORY
Router.put('/:mainCategory', (req, res) => {
    UserDao.verifyAdmin(req.body.username, req.body.password)
        .then(() => {
            req.body.location = req.restQueryParams.location;

            if (!validateSchema(req, res, schemaAddCategory))
                return;

            // CHECK IF MAIN CATEGORY EXISTS
            let primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, req.params.mainCategory);
            CategoryDao.ifExists(req, primaryKey)
                .then((data) => {
                    if (data.Items.length == 0) {
                        ResponseModels.simpleBadRequest(res, "Parent category does not exist")
                    } else {
                        primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, req.body.child, req.params.mainCategory);
                        CategoryDao.insert(req, primaryKey)
                            .then(() => ResponseModels.simpleSuccess(res, "Added new category", res.body))
                            .catch((err) => ResponseModels.simpleFail(res, "Failed to add a new category", err.message));
                    }
                })
                .catch((err) => ResponseModels.simpleFail(res, "Failed to add a new category", err.message));


        })
        .catch((err) => ResponseModels.rejectAuth(res, err.message));
});

//ADD SUB-SUB CATEGORY INTO SUB CATEGORY
Router.put('/:mainCategory/:subCategory', (req, res) => {
    UserDao.verifyAdmin(req.body.username, req.body.password)
        .then(() => {
            req.body.location = req.restQueryParams.location;

            if (!validateSchema(req, res, schemaAddCategory))
                return;
            // CHECK IF MAIN CATEGORY # SUB CATEGORY EXISTS
            let primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, req.params.subCategory, req.params.mainCategory);

            CategoryDao.ifExists(req, primaryKey)
                .then((data) => {
                    if (data.Items.length == 0) {
                        ResponseModels.simpleBadRequest(res, "Parent category does not exist")
                    } else {
                        primaryKey = DbPrimaryKeys.PRIMARY_KEY_INSERT_CATEGORY_METADATA(req.body.location, req.body.child, req.params.mainCategory, req.params.subCategory);

                        CategoryDao.insert(req, primaryKey)
                            .then(() => ResponseModels.simpleSuccess(res, "Added new category", res.body))
                            .catch((err) => ResponseModels.simpleFail(res, "Failed to add a new category", err.message));
                    }
                })




        })
        .catch((err) => ResponseModels.rejectAuth(res, err.message));
});


function formatItems (data){

    data.result = [];
    for (let i=0 ; i<data.Items.length ; i++){
        data.result.push( data.Items[i].SK );
    }
    delete data['Items'];

    return data;
}

function validateSchema(req, res, schema) {
    const {
        error
    } = schema.validate(req.body);
    if (error) {
        ResponseModels.invalidData(res, error.message);
        return false;
    }
    return true;
}

module.exports = Router;