var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var Order = require('../models/donhang');
var mongoose = require('mongoose');
var Brand = require('../models/brand');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var curpage=1;



/*------------------Trang hiển thị toàn bộ sản phẩm--------------------------*/
router.get('/', function(req, res, next) {
    var page=1;
    if(curpage != 1)
    {
        page=curpage;
    }
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {
            Product.find(function (err,docs) {
                var productChuck = initPage(page,docs);
                var arrPage = createArrPage(docs,null,page);
                curpage=1;
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Toàn bộ sản phẩm',brand:brand,user:req.user,message:req.flash('info')});
            });

        });
    });
});


router.post('/index/page',function (req,res) {
    curpage = parseInt(req.body.page);
    if(curpage==1)
        searching=1;
    res.send('thanhcong');
});


/*--------------------Trang hiển thị sản phẩm theo loại---------------------------*/
router.get("/category/loai/:id",function (req,res,next) {
    var page=1;
    if(curpage != 1)
    {
        page=curpage;
    }
    var currentpage = '/category/loai/'+req.params.id;
    Loai.find(function (err,result) {
        Product.find({loai:req.params.id},function (err,docs) {
            Loai.findOne({_id:req.params.id},function (err,result1) {
                if(result1== null)
                {
                    req.flash('info','Loại Sản phẩm không tồn tại trên hệ thống.');
                    res.redirect('/error');
                }
                else {
                    var productChuck = initPage(page, docs);
                    var arrPage = createArrPage(docs, currentpage, page);
                    curpage = 1;
                    res.render('index', {
                        title: 'eShop',
                        products: productChuck,
                        pages: arrPage,
                        loai: result,
                        current_cate: result1.ten,
                        user: req.user
                    });
                }
            });
        });
    });
});




/*--------------------Trang hiển thị sản phẩm theo nhãn hiệu---------------------------*/
router.get("/brand/:id",function (req,res,next) {
    var page=1;
    if(curpage != 1)
    {
        page=curpage;
    }
    var currentpage = '/brand/'+req.params.id;
    Loai.find(function (err,result) {
        Product.find({nhanhieu:req.params.id},function (err,docs) {
            Brand.find(function (err,brand) {
                Brand.findOne({_id:req.params.id},function (err,result1) {
                    if(result1 == null)
                    {
                        req.flash('info','Nhãn hiệu Sản phẩm không tồn tại trên hệ thống.');
                        res.redirect('/error');
                    }
                    else {
                        var productChuck = initPage(page, docs);
                        var arrPage = createArrPage(docs, currentpage, page);
                        curpage = 1;
                        res.render('index', {
                            title: 'eShop',
                            products: productChuck,
                            pages: arrPage,
                            loai: result,
                            brand: brand,
                            current_cate: result1.ten,
                            user: req.user
                        });
                    }
                });
            });

        });
    });
});



/*--------------------------------Trang sản phẩm hiển thị theo giá tiền tăng giảm---------------------------*/
router.get("/category/sort/inc",function (req,res,next) {
    var page=1;
    if(curpage != 1)
    {
        page=curpage;
    }
    var currentpage = '/category/sort/inc';
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {
            Product.find().sort({gia:1}).exec(function (err,docs) {
                var productChuck = initPage(page,docs);
                var arrPage = createArrPage(docs,currentpage,page);
                curpage=1;
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,brand:brand,current_cate:'Giá tiền tăng dần',user:req.user});
            });
        });
    });

});

router.get("/category/sort/dec",function (req,res,next) {
    var page=1;
    if(curpage != 1)
    {
        page=curpage;
    }
    var currentpage = '/category/sort/dec';
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {
            Product.find().sort({gia:-1}).exec(function (err,docs) {
                var productChuck = initPage(page,docs);
                var arrPage = createArrPage(docs,currentpage,page);
                curpage=1;
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,brand:brand,current_cate:'Giá tiền giảm dần',user:req.user});
            });
        });
    });

});

/*------------------------------Tìm kiếm sản phẩm---------------------------------*/


router.get("/search",function (req,res) {
    var page = 1;
    if (curpage != 1) {
        page = curpage;
    }
    var input = change_alias(req.query.search);
    var idLoai = req.query.idLoai;
    var idBrand = req.query.idBrand;
    var gia = req.query.idGia;
    var currentpage = '/search/' + input;
    Brand.find(function (err, brand) {
        Loai.find(function (err, result1) {
            const regex = new RegExp(escapeRegex(input), 'gi');
            Product.find({tenTimKiem: regex}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if(idLoai != null)
                    {
                        for(var i=0;i<result.length;i++)
                        {
                            if(result[i].loai != idLoai)
                            {
                                result.splice(i,1);
                                i--;
                            }

                        }
                    }
                    if(idBrand != null)
                    {
                        for(var i=0;i<result.length;i++)
                        {
                            if(result[i].nhanhieu != idBrand)
                            {
                                result.splice(i,1);
                                i--;
                            }
                        }
                    }
                    if(gia == "inc")
                    {
                        result.sort(function (a,b) {
                            return a.gia - b.gia;
                        });
                    }
                    if(gia == 'dec')
                    {
                        result.sort(function (a,b) {
                            return a.gia - b.gia;
                        });
                        result.reverse();
                    }
                    productChuck = initPage(page, result);
                    arrPage = createArrPage(result, currentpage, page);
                    curpage = 1;
                    res.render('index', {
                        title: 'eShop',
                        products: productChuck,
                        brand: brand,
                        pages: arrPage,
                        loai: result1,
                        current_cate: 'Tất cả kết quả về ' + req.query.search,
                        user: req.user,
                        message: req.flash('info')
                    });
                }
            });


        });
    });
});


router.get("/error",function (req,res,next) {
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {

            res.render('error', {message: req.flash('info'),brand:brand,user:req.user,loai:result});
        });
    });

});

router.post("/error",function (req,res,next) {
   var data="Success";
   res.send(data);
});

/*------------------------Hàm quản lý đặt hàng-------------*/
router.get("/checkout",isLoggedIn,function (req,res,next) {
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {
            res.render('checkout',{title:'eShop - Thanh toán',message: req.flash('info'),user:req.user,loai:result,loai:result,brand:brand });
        });
    });

});


router.post("/checkout",function (req,res,next) {
    var data = req.body;
    //Data nhận từ Client

    var neworder = new Order({
        tenkhachhang: data.tenkhachhang,
        idthanhvien: data.idthanhvien,
        sodienthoai: data.sodienthoai,
        diachinhanhang: data.diachinhanhang,
        thanhtoan: data.thanhtoan,
        trangthai: "Chưa Xử Lý",
        sanpham: data['sanpham[]'],
        soluong: data['soluong[]'],
        gia: data['gia[]'],
        ngaygio: new Date(),
        ghichu: data.ghichu
    });



    neworder.save(function(err){
        if (err)
        {
            console.log(err);
            res.status(409).send('connot save');
        }
        else
        {
            res.send('okay');
        }
    });
});


router.get("/order/generate", function(){
    var randomproducts = [];
    var prices = [];
    var amount = []
    var randomproductnumber = parseInt(Math.random() * 9) + 1; //ngẫu nhiên 1 giá trị từ 1->10
   
    Product.findRandom({}, {}, {limit: randomproductnumber},function (err, result){
        
        for (var i = 0; i < result.length; i++) {
            var whatID = result[i]._id;
            var whatPrice = result[i].gia;
            randomproducts.push(whatID);
            prices.push(whatPrice);
            amount.push(parseInt(Math.random() * 2) + 1);

        }


        var neworder = new Order({
            tenkhachhang: "Lê Trí Khoa",
            idthanhvien: "",
            sodienthoai: '0123456789',
            diachinhanhang: "227, Nguyễn Văn Cừ",
            thanhtoan: "COD",
            trangthai: "Chưa Xử Lý",
            sanpham: randomproducts,
            soluong: amount,
            gia: prices,
            ngaygio: Date(),
            ghichu: "đơn hàng phát sinh tự động"
        });


        neworder.save(function(err){
            if (err)
            {
                console.log(err);
            }
            else
            {
                console.log("saved");
            }
        });
    });

});

router.post("/checkavailable",function (req,res,next) {
    var id =req.body.id;
        Product.findOne({_id:id},function (err,doc) {
        if(doc == null)
        { var data = {ten:'SP đã xoá',gia:0};
            res.send(data);
        }
       else
        {
            var data = {ten:doc.ten,gia:doc.gia};
            res.send(data);
        }
    });

});

/*-----------------Test -----------------------*/


router.get("/todolist",function (req,res,next) {
    Brand.find(function (err,brand) {
        Loai.find(function (err,result) {
            res.render('toDolist', {title:'eShop - Bảng chức năng',message: req.flash('info'),brand:brand,user:req.user,loai:result});
        });
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
    if(docs.length > 12)
    {
        allPage = parseInt( docs.length / 12);
        var konorimono = parseInt( docs.length) - allPage * 12;
        if(konorimono > 0)
            allPage++;
    }
    return allPage;
}

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str;
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/*-------------------Các hàm hỗ trợ xác thực-------------------------*/
function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated()) {
        if(req.session.user.active)
        return next();
        else
        {
            req.flash('info','Tài khoản của bạn chưa được kích hoạt.');
        }
        res.redirect('/error');
    }
    else {
        // Nếu chưa, đưa về trang chủ
        res.redirect('/login');
    }
}

module.exports = router;
