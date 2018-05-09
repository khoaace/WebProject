var express = require('express');
var router = express.Router();
var Product =  require('../models/product');


/* GET home page. */
router.get('/:id', function(req, res, next) {
        var id = req.params.id;
   Product.findOne({ma:id},function (err,result) {
       res.render('product',{product:result});
       console.log(result);
    });
});

module.exports = router;