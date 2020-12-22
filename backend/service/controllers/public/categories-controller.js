const Router = require('express').Router();
const CategoryDac = require('../../../data_access/category-dac');
const ResponseModels = require('../../../utils/ResponseModels')
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

    CategoryDac.getCategory(req.rest.location, true)
    .then(data=>{
        
        ResponseModels.simpleSuccess(res, data.from_cache? "From cache":"", JSON.parse(data.Body.toString('utf-8')));
        
    })
    .catch(error=>{
        ResponseModels.simpleFail(res, "Failed", error.message);
    })
});


Router.get('/:sub_category', async function(req, res){

    const {error : schemaError} = locationNameSchema.validate(req.rest);
    if (schemaError){
        ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
        return;
    }

    CategoryDac.getCategory(req.rest.location, true)
    .then(data=>{
        
        ResponseModels.simpleSuccess(res, data.from_cache? "From cache":"", JSON.parse(data.Body.toString('utf-8'))[req.params.sub_category]  );
        
    })
    .catch(error=>{
        ResponseModels.simpleFail(res, "Failed", error.message);
    })
});

Router.get('/:sub_category/:child_category', async function(req, res){

    const {error : schemaError} = locationNameSchema.validate(req.rest);
    if (schemaError){
        ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
        return;
    }

    CategoryDac.getCategory(req.rest.location, true)
    .then(data=>{
        
        ResponseModels.simpleSuccess(res, data.from_cache? "From cache":"", JSON.parse(data.Body.toString('utf-8'))[req.params.sub_category][req.params.child_category]  );
        
    })
    .catch(error=>{
        ResponseModels.simpleFail(res, "Failed", error.message);
    })
});

module.exports = Router;