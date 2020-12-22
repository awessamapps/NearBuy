const Router = require('express').Router();
const Joi = require('joi');
const ResponseModels = require('../../../utils/ResponseModels')
const LocationDAC = require('../../../data_access/location-dac');
const geolib = require('geolib');

const schemaInsertLocation = Joi.object({

    locationName : Joi.string().trim().max(20).min(3).required(),
    latitude : Joi.number().required(),
    longitude : Joi.number().required()
}).unknown(true);


const schemaGetLocation = Joi.object({

    latitude : Joi.number().required(),
    longitude : Joi.number().required()
})

Router.get('/', async (req, res)=>{

    let queryParams = {};
    queryParams.latitude = req.query.latitude;
    queryParams.longitude = req.query.longitude;

    

    if ( !(queryParams.latitude && queryParams.longitude)){
        // return everything

        try{
            const data = await LocationDAC.findAll();
            ResponseModels.simpleSuccess(res, "All locations", data);
        }
    
       catch(e){
           ResponseModels.simpleFail(res, "Failed", e.message);
       }
    }

    else {

        const {error: schemaError } = schemaGetLocation.validate(queryParams);

        if (schemaError){
            ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
            return;
        }


         // return location with minimum distance
         try{
            const data = await LocationDAC.findAll();
         
            const distances = data.Items.map(item=>{
                return geolib.getDistance({latitude: item.latitude, longitude: item.longitude}, queryParams,1)
            });

            const locationSelected = data.Items [distances.indexOf( Math.min(...distances)  )];

            ResponseModels.simpleSuccess(res, "", locationSelected);
        }
    
       catch(e){
           ResponseModels.simpleFail(res, "Failed", e.message);
       }

       

    }
    

   

});


Router.delete('/delete', async function(req, res){

    ResponseModels.simpleBadRequest(res, "TODO",{});
})

Router.put('/', async (req, res)=>{

    let locationData = {

        locationName : req.body.location_name,
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        username : req.body.admin_id,
        ipAddress : req.app.ip,
        active : true
    }

    const {error : schemaError } = schemaInsertLocation.validate(locationData);

    if (schemaError){
        ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
        return;
    }

    try{
         await LocationDAC.insert(locationData);
         ResponseModels.simpleSuccess(res, "Inserted", {});
    }

    catch(e){
        ResponseModels.simpleFail(res, "Failed", e.message);
    }

});


module.exports = Router;