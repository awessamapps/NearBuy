const Router = require('express').Router();
const Joi = require('joi');
const ResponseModels = require('../../../Utils/ResponseModels')
const LocationDAC = require('../../../data_access/location-dac');
const geolib = require('geolib');



const schemaGetLocation = Joi.object({

    latitude : Joi.number().required(),
    longitude : Joi.number().required()
})

Router.get('/', async (req, res)=>{

    let queryParams = {};
    queryParams.latitude = req.query.latitude;
    queryParams.longitude = req.query.longitude;


    const {error: schemaError } = schemaGetLocation.validate(queryParams);

        if (schemaError){
            ResponseModels.simpleBadRequest(res, "Failed", schemaError.message);
            return;
        }
         try{
            const data = await LocationDAC.findAll(true);

         
            const distances = data.Items.map(item=>{
                return geolib.getDistance({latitude: item.latitude, longitude: item.longitude}, queryParams,1)
            });

            let locationSelected = data.Items [distances.indexOf( Math.min(...distances)  )].SK;

            let resData = {
                location : locationSelected
            };

            ResponseModels.simpleSuccess(res, data.from_cache? "From cache":"", resData);
        }
    
       catch(e){
           ResponseModels.simpleFail(res, "Failed", e.message);
       }
   

});



module.exports = Router;