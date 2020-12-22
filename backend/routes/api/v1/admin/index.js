const router = require('express').Router();



router.use('/browse/:location/categories', (req, res, next)=>{

    req.rest = req.rest? req.rest : {};
    req.rest.location = req.params.location;
    next();
}, require('../../../../service/controllers/admin/browse/categories-controller-admin'));



router.use('/locations', require('../../../../service/controllers/admin/location-controller-admin'));




module.exports = router;