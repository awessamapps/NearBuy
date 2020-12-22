const Router = require('express').Router();
const Joi = require('joi');
const SimpleResponse = require('../../utils/ResponseModels')

const schema = Joi.object({

    admin_id : Joi.string().trim().min(6).required(),
    admin_password : Joi.string().trim().min(6).required() 
}).unknown(true);

let admins = {}
admins['admin1']='password1';


Router.use('/', function(req,res, next){



    let authBody = {};

    authBody.admin_id = req.headers['authorization-id'];
    authBody.admin_password = req.headers['authorization-pass'];


   const {error : validationError } = schema.validate(authBody);

   if (validationError){
       res.send( SimpleResponse.notAdmin(res, "Task failed successfully :-p", validationError)  );
   }
   else {
       if (admins[authBody.admin_id]===authBody.admin_password){
           next();
       }
       else {
        res.send( SimpleResponse.notAdmin(res, "Admin username / password is wrong", "" ) );
       }
   }

})

module.exports = Router;