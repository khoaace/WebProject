var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Binhluan = require('../models/binhluan');
var Loai = require('../models/loai');
var bodyParser = require('body-parser');
var User  =require('../models/user');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var number4related = 4;
var curpage="";

router.get('/detail/:id', function(req, res, next) {
    var id = req.params.id;
    var page=1;
    if(curpage !="")
        page=curpage;
    Product.findOne({_id:id},function (err,result) {
        Loai.find(function (err,result1) {
            Loai.findOne({_id:result.loai},function (err,result2){
                Product.findRandom({loai: result2._id}, {}, {skip: 10, limit: number4related},function (err, relatedproductresult){
                    Binhluan.find({sanpham:id},function (err,binhluan) {
                        binhluan.reverse();
                        var binhluanChuck = initPage(page,binhluan);
                        var arrPage = createArrPage(binhluan,null,page);
                        curpage="";
                        res.render('product/product-detail',{title:'eShop-'+result.ten,product:result,product_loai:result2,loai:result1,relatedproducts:relatedproductresult,current_cate:result2.ten,binhluan:binhluanChuck,pages:arrPage,user:req.user});
                    });
                });
           });
       });
    });
});


router.post('/detail/comment/page',function (req,res) {
    curpage = parseInt(req.body.page);
    res.send('thanhcong');
});

/*-------------------------------Bình luận sản phẩm------------------------------*/
router.post('/detail/comment',function (req,res,next) {
    var dateCmt = Date();
    var nguoibinhluan;
    User.findOne({username:req.body.nguoibinhluan},function (err,doc) {
       if(doc)
       {
           nguoibinhluan=req.body.nguoibinhluan;
       }
       else
       {
           nguoibinhluan= '[Khách]-'+req.body.nguoibinhluan;
       }
       console.log(nguoibinhluan);
        var binhluan = new Binhluan();
        binhluan.nguoibinhluan = nguoibinhluan;
        binhluan.thoigian = dateCmt;
        binhluan.noidung = req.body.noidung;
        binhluan.sanpham =req.body.sanpham;
        binhluan.save(function (err) {
            if(err) {
                res.status(400).send('loi');
                throw err;
            }
            res.send("thanhcong");
        });
    });


});

router.post('/detail/comment/update',function (req,res,next) {
        curpage=req.body.curpage;
        Binhluan.where({_id:req.body.idCmt}).update({noidung:req.body.noidung}).exec(function (err,doc) {
            console.log(doc);
            res.send("thanhcong");
        });

});

router.post('/detail/comment/delete',function (req,res,next) {
    Binhluan.deleteOne({_id:req.body.idCmt},function (err,result) {
        res.send("thanhcong");
    });
});

router.post('/detail/comment/check',function (req,res,next) {
    if (req.session.user.username.localeCompare(req.body.nguoibinhluan)==0 || req.session.user.mod) {
        res.send("thanhcong");
    }
    else
    {
        res.send("thatbai").status(500);
    }
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
function initPage(page,docs) {
    page =(page-1)*8;
    var productChuck=[];
    var count = 0;
    var chucksize = 4; //  1 hàng có 4 sp
    //Thêm 4 sản phẩm vào mảng
    for(var i=page;i<docs.length;i++)
    {
        if(count>7)
            break;
        productChuck.push(docs[i]);
        count++;
    }
    return productChuck;
}


function createArrPage(docs,currentPage,page) {
    var allPage=countPage(docs);
    var arr=[];
    if(page > allPage)
        page=allPage;
    for (var i = 0; i < allPage; i++) {
        if((i+1) == page)
            arr[i] = [i + 1, currentPage,"active"];
        else
            arr[i] = [i + 1, currentPage,""];
    }
    return arr;
}

function countPage(docs) {
    var allPage=1;
    if(docs.length > 8)
    {
        allPage = parseInt( docs.length / 8);
        var konorimono = parseInt( docs.length) - allPage * 8;
        if(konorimono > 0)
            allPage++;
    }
    return allPage;
}

module.exports = router;

