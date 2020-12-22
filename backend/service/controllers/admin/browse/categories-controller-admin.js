const Router = require('express').Router();
const CategoryDac = require('../../../../data_access/category-dac');
const ResponseModels = require('../../../../utils/ResponseModels')
const Joi = require('joi');

const locationNameSchema = Joi.object({
    location : Joi.string().min(3).max(15).required()
});



// get entire thing from s3

Router.get('/', async function(req, res){

    const {error : schemaError} = locationNameSchema.validate(req.rest);
    if (schemaError){
        ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
        return;
    }

    CategoryDac.getCategory(req.rest.location)
    .then(data=>{
        
        ResponseModels.simpleSuccess(res, "", JSON.parse(data.Body.toString('utf-8')));
        
    })
    .catch(error=>{
        ResponseModels.simpleFail(res, "Failed", error.message);
    })
})


// put entire thing location wise into s3
Router.put('/', async function(req, res){

    const {error : schemaError} = locationNameSchema.validate(req.rest);
        if (schemaError){
            ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
            return;
        }

    CategoryDac.putCategory(req.rest.location, req.body)
    .then(data =>{
          ResponseModels.simpleSuccess(res, "");
    })
    .catch(error=>{
        ResponseModels.simpleFail(res, "Failed", error.message);
    })
});



// get new category image as a signed url from s3.

Router.get('/new-image', async function(req, res){

    // return a signed url from s3 bucket. url-> /location/categories/dp/microseconds.jpg
    try{

        const {error : schemaError} = locationNameSchema.validate(req.rest);
        if (schemaError){
            ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
            return;
        }
        const url = await CategoryDac.getSignedUrlForImage(req.rest.location);
        ResponseModels.simpleSuccess(res, "", {url : url.substring(0, url.indexOf('.jpg?'))+'.jpg', signed_url : url});

    }
    catch(error){
        ResponseModels.simpleFail(res, "Failed", error.message);
    }
})



module.exports = Router;