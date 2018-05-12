var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/*Trang sản phẩm*/
router.get('/', function(req, res, next) {
  Loai.find(function (err,result) {
      Product.find(function (err,docs) {
          var productChuck = initPage(1,docs);
          var arrPage = createArrPage(docs,null);
          res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
      });

  });

});

//Xử lý trang sản phẩm page 1,2,3,4
router.get('/page/:number',function (req,res,next) {
  var page = req.params.number;
  Loai.find(function (err,result) {
      Product.find(function (err,docs) {
          var productChuck = initPage(page,docs);
          var arrPage = createArrPage(docs,null);
          res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
      });
    });
});

router.get("/category/loai/:id",function (req,res,next) {
  var curentPage = '/category/loai/'+req.params.id;
    Loai.find(function (err,result) {
        Product.find({loai:req.params.id},function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});


//Xử lý trang sản phẩm da phan loai page 1,2,3,4
router.get("/category/loai/:id/page/:number",function (req,res,next) {
    var curentPage = '/category/loai/'+req.params.id;
    var page = req.params.number;
    Loai.find(function (err,result) {
            Product.find({loai:req.params.id},function (err,docs) {
                var productChuck = initPage(page,docs);
                var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});


router.get("/category/sort/inc",function (req,res,next) {
    var curentPage = '/category/sort/inc';
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});

router.get("/category/sort/dec",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});


router.get("/category/sort/inc/page/:number",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var productChuck = initPage(page,docs);
            var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});
router.get("/category/sort/dec/page/:number",function (req,res,next) {
    var curentPage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var productChuck = initPage(page,docs);
            var arrPage = createArrPage(docs,curentPage);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result});
        });
    });
});

 router.post("/search",urlencodedParser,function (req,res) {

        res.render('error', { title: 'eShopping',message:'Chức năng chưa được hỗ trợ'});

 });


router.get("/error",function (req,res,next) {
  res.render('error',{message:'Không tìm thấy trang web'});
});


/*--------------------------------->Hàm xử lý<-----------------------------------------*/
function initPage(page,docs) {
    page =(page-1)*8;
    var productChuck=[];
    var count = 0;
    var chucksize = 4; //  1 hàng có 4 sp
    //Thêm 4 sản phẩm vào mảng
    for(var i=page;i<docs.length;i+=chucksize)
    {
        if(count>1)
            break;
        productChuck.push(docs.slice(i,i+chucksize));
        count++;
    }
  return productChuck;
}


function createArrPage(docs,currentPage) {
    var allPage=1;
    if(docs.length > 8)
    {
        allPage = parseInt( docs.length / 8);
        if((docs.length / 2.0) != 0)
            allPage++;
    }
    var arr=[];
    for (var i = 0; i < allPage; i++) {
        arr[i] = [i + 1, currentPage];
    }
    return arr;
}



module.exports = router;
