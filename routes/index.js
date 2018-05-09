var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Product =  require('../models/product');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find(function (err,docs) {
    var productChuck =[];
    var chucksize = 4; //  1 hàng có 4 sp
      //Thêm 4 sản phẩm vào mảng
      for(var i=0;i<docs.length;i+=chucksize)
      {
        productChuck.push(docs.slice(i,i+chucksize));
      }
      res.render('index', { title: 'eShopping',products:productChuck });
  });
});

router.post("/",urlencodedParser,function (req,res) {
    var ten = req.body.Search;
    Product.find({ten:ten},function (err,result) {
        var productChuck =[];
        var chucksize = 4; //  1 hàng có 4 sp
        //Thêm 4 sản phẩm vào mảng
        for(var i=0;i<result.length;i+=chucksize)
        {
            productChuck.push(result.slice(i,i+chucksize));
        }
        res.render('index', { title: 'eShopping',products:productChuck });
    });
});


module.exports = router;
