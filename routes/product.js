var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var number4related = 4;


router.get('/detail/:id', function(req, res, next) {
    var id = req.params.id;
    Product.findOne({_id:id},function (err,result) {
        Loai.find(function (err,result1) {
            Loai.findOne({_id:result.loai},function (err,result2){
                Product.findRandom({loai: result2._id}, {}, {skip: 10, limit: number4related},function (err, relatedproductresult){

                 res.render('product/product-detail',{title:'eShop-'+result.ten,product:result,product_loai:result2,loai:result1,relatedproducts:relatedproductresult,current_cate:result2.ten,user:req.user});
                });
           });
       });
    });
});

/*------------------------>Phát sinh dữ liệu<-----------------------------*/

var loai = [
    new Loai({ten:'Ghế Giám Đốc'}),
    new Loai({ten:'Ghế Văn Phòng'}),
    new Loai({ten:'Ghế Nhân Viên'}),
    new Loai({ten:'Ghế Chân Quỳ'})
];

var products = [
    new Product({
        ma: "01",
        ten: "Ghế dựa",
        gia: 50000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 2",
        gia: 100000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 3",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 4",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ma: "01",
        ten: "Ghế dựa 5",
        gia: 50000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 6",
        gia: 100000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 7",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 8",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ma: "01",
        ten: "Ghế dựa 9",
        gia: 50000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 10",
        gia: 100000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 11",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    }),
    new Product({
        ten: "Ghế dựa 12",
        gia: 200000,
        loai: loai[0],
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:["/images/gheXoay.PNG","/images/gheChanQuy.png"]
    })
];

router.get('/random_generate', function(req, res, next) {

            for (var i = 0; i < loai.length; i++) {
                loai[i].save(function (err, result) {
                });
            }
    for(var i=0;i<products.length;i++)
    {
        products[i].save(function (err,result) {
        });
    }
    res.redirect('/');
});


/*--------------------------------------->Hàm xử lý<----------------------------------------*/

module.exports = router;

