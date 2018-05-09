var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eshopping');
var products = [
    new Product({
        ma: "01",
        ten: "Ghế dựa",
        gia: 500000,
        loai: "Ghế dựa",
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["images/gheXoay.PNG","images/gheChanQuy.png"]
    }),
    new Product({
        ma: "02",
        ten: "Ghế văn phòng",
        gia: 3000000,
        loai: "Ghế xoay",
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["images/gheXoay.PNG","images/gheChanQuy.png"]
    }),
    new Product({
        ma: "03",
        ten: "Ghế giám đốc",
        gia: 5000000,
        loai: "Ghế xoay",
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["images/gheXoay.PNG","images/gheChanQuy.png"]
    }),
    new Product({
        ma: "04",
        ten: "Ghế nhựa",
        gia: 10000,
        loai: "Ghế dựa",
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["images/gheXoay.PNG","images/gheChanQuy.png"]
    }),
];
/* GET home page. */
router.get('/', function(req, res, next) {
    var done =0;
    for(var i=0;i<products.length;i++)
    {
        products[i].save(function (err,result) {
            done++;
        });
    }
        res.render('addProduct');
});

module.exports = router;