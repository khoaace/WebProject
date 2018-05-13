var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/detail/:id', function(req, res, next) {
        var id = req.params.id;
   Product.findOne({_id:id},function (err,result) {
       Loai.find(function (err,result1) {
           Loai.findOne({_id:result.loai},function (err,result2){
               res.render('product/product-detail',{title:'eShop-'+result.ten,product:result,product_loai:result2,loai:result1});
           });
       });
    });
});

router.get('/add', function(req, res, next) {
    Loai.find(function (err,result) {
        if(err)
            console.log(err);
        res.render('product/product-add',{title:'eShop-Add Product',loai:result,message: req.flash('info')});
    });
});

router.get('/add/error',function (req,res,next) {
    var id = req.params.id;
        req.flash('info', ['alert-danger','Chưa điền link ảnh.']);
    res.redirect('/product/add');
});
router.get('/add/success',function (req,res,next) {
    req.flash('info',['alert-success','Thêm sản phẩm thành công.']);
    res.redirect('/product/add');
});

router.post("/add",urlencodedParser,function (req,res) {
    var ten = req.body.ten;
    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;
    var mmota = req.body.mota;
    var hinhanh = req.body.hinhanh;
    Product.findOne(function (err,result1) {
        if(hinhanh[0] == null)
        // Nếu chưa điền link ảnh thì báo lỗi
            res.redirect('/product/add/error');
        if(gia < 0)
            res.redirect('/product/add/error');
        else {
            //Sau khi kiểm tra xong tiến hành lưu
            Loai.findOne({ten: req.body.loai}, function (err, result) {
                var product = new Product({
                    ten: ten,
                    gia: gia,
                    loai: result,
                    nhanhieu: nhanhieu,
                    xuatxu: xuatxu,
                    hinhanh: hinhanh,
                    mota: mmota
                });
                product.save(function (err, result) {
                    res.redirect('/product/add/success');
                });
            });
        }
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

router.get('/generate', function(req, res, next) {

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

