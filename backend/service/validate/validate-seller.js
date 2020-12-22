const Router = require('express').Router();
const Joi = require('Joi');
const SimpleResponse = require('../../Utils/ResponseModels')

const schema = Joi.object({

    auth : Joi.string().trim().min(6).required()
}).unknown(true);

let sellers = ['seller1']

Router.use('/', function(req,res, next){



    let authBody = {};

    authBody.auth = req.headers['authorization'];


   const {error : validationError } = schema.validate(authBody);

   if (validationError){
       res.send( SimpleResponse.notAdmin(res, "Task failed successfully :-p", validationError)  );
   }
   else {
       if (sellers.indexOf(authBody.auth)>-1){
           next();
       }
       else {
        res.send( SimpleResponse.notAdmin(res, "Seller auth failed", "" ) );
       }
   }

})

module.exports = Router;