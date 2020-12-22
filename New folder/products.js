const Router = require('express').Router();
const UserDao = require('../../../service/db/userDao');
const ResponseModels = require('../../../Utils/responseModels');
const Joi = require('joi');


// const createProductSchema = Joi.object({

//     product_name : Joi.string().trim().alphanum().min(5).max(255).required(),
//     product_category_1 : Joi.string().trim(). 

// });

Router.put("/", (req,res)=>{

    UserDao.verifySellerLoggedIn(req.body.sellerId, req.headers.token)
    .then((err )=>{
        
        res.json(req.body);

        return;

    })
    .catch((err)=> ResponseModels.rejectAuth(res) );

    

})

module.exports = Router;