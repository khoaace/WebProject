var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
mongoose.connect('mongodb://localhost:27017/eshopping');

router.get('/', function(req, res, next) {
    res.render('add');
});

router.post("/",urlencodedParser,function (req,res) {
    var ma = req.body.ma;
    var ten = req.body.ten;
    var loai = req.body.loai;
    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;
    var mmota = req.body.gia;
    var hinhanh = ["images/gheXoay.PNG","images/gheChanQuy.png"];
    var product = new Product({
        ma: ma,
        ten: ten,
        gia: gia,
        loai: loai,
        nhanhieu: nhanhieu,
        xuatxu:xuatxu,
        hinhanh:hinhanh,
        mota:mmota
    });
    console.log(product);
    product.save(function (err,result) {
        res.render('addProduct');
    });
});
module.exports = router;