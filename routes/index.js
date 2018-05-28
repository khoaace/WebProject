var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


/*------------------Trang hiển thị toàn bộ sản phẩm--------------------------*/
router.get('/', function(req, res, next) {
  Loai.find(function (err,result) {
      Product.find(function (err,docs) {
          var productChuck = initPage(1,docs);
          var arrPage = createArrPage(docs,null,1);
          res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Toàn bộ sản phẩm',user:req.user,message:req.flash('info')});
      });

  });

});

//Xử lý chuyển trang
router.get('/page/:number',function (req,res,next) {
  var page = req.params.number;
  Loai.find(function (err,result) {
      Product.find(function (err,docs) {
          var productChuck = initPage(page,docs);
          var arrPage = createArrPage(docs,null,page);
          res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Toàn bộ sản phẩm',user:req.user});
      });
    });
});

/*--------------------Trang hiển thị sản phẩm theo loại---------------------------*/
router.get("/category/loai/:id",function (req,res,next) {
  var curentPage = '/category/loai/'+req.params.id;
    Loai.find(function (err,result) {
        Product.find({loai:req.params.id},function (err,docs) {
            Loai.findOne({_id:req.params.id},function (err,result1) {
                var productChuck = initPage(1,docs);
                var arrPage = createArrPage(docs,curentPage,1);
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:result1.ten,user:req.user});
            });
        });
    });
});


//Xử lý chuyển trang
router.get("/category/loai/:id/page/:number",function (req,res,next) {
    var curentPage = '/category/loai/'+req.params.id;
    var page = req.params.number;
    Loai.find(function (err,result) {
            Product.find({loai:req.params.id},function (err,docs) {
                Loai.findOne({_id:req.params.id},function (err,result1) {
                var productChuck = initPage(page,docs);
                var arrPage = createArrPage(docs,curentPage,page);
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:result1.ten,user:req.user});
                    });
        });
    });
});

/*--------------------------------Trang sản phẩm hiển thị theo giá tiền tăng giảm---------------------------*/
router.get("/category/sort/inc",function (req,res,next) {
    var curentPage = '/category/sort/inc';
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,curentPage,1);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Giá tiền tăng dần',user:req.user});
        });
    });
});

router.get("/category/sort/dec",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,curentPage,1);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Giá tiền giảm dần',user:req.user});
        });
    });
});

// xử lý chuyển trang
router.get("/category/sort/inc/page/:number",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var productChuck = initPage(page,docs);
            var arrPage = createArrPage(docs,curentPage,page);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Toàn bộ sản phẩm',user:req.user});
        });
    });
});
router.get("/category/sort/dec/page/:number",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var productChuck = initPage(page,docs);
            var arrPage = createArrPage(docs,curentPage,page);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Toàn bộ sản phẩm',user:req.user});
        });
    });
});

 router.post("/search",urlencodedParser,function (req,res) {
        res.render('error', { title: 'eShopping',message:'Chức năng chưa được hỗ trợ'});
 });


router.get("/error",function (req,res,next) {
    Loai.find(function (err,result) {
        res.render('error', {message: req.flash('info'),user:req.user,loai:result});
    });
});


/*--------------------------------->Hàm xử lý<-----------------------------------------*/
function initPage(page,docs) {
    page =(page-1)*12;
    var productChuck=[];
    var count = 0;
    var chucksize = 4; //  1 hàng có 4 sp
    //Thêm 4 sản phẩm vào mảng
    for(var i=page;i<docs.length;i+=chucksize)
    {
        if(count>2)
            break;
        productChuck.push(docs.slice(i,i+chucksize));
        count++;
    }
    return productChuck;
}


function createArrPage(docs,currentPage,page) {
    var allPage=1;
    if(docs.length > 12)
    {
        allPage = parseInt( docs.length) / 12;
        var konorimono = parseInt( docs.length) - allPage * 12;
        if(konorimono > 0)
            allPage++;
    }
    var arr=[];
    for (var i = 0; i < allPage; i++) {
        if((i+1) == page)
            arr[i] = [i + 1, currentPage,"active"];
        else
            arr[i] = [i + 1, currentPage,""];
    }
    return arr;
}


module.exports = router;
