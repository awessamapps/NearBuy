const router = require('express').Router();


// router.use('/products', require('./products'));

// router.use('/browse/:location/categories', (req, res, next) => {
//       req.restQueryParams = {};
//       req.restQueryParams.location = req.params.location;
//       next();
//     },
//     require('./categories'));


router.use('/admin', require('../../../service/validate/validate-admin') , require('./admin'));
router.use('/locations', require('../../../service/controllers/public/location-controller'));


router.use('/seller', require('../../../service/validate/validate-seller'));

router.use('/browse/:location/categories', (req, res, next) => {
      req.rest = {};
      req.rest.location = req.params.location;
      next();
    },
    require('../../../service/controllers/public/categories-controller'));



module.exports = router;