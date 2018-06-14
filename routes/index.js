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
            var allPage = countPage(docs);
            if(page > allPage || page <1)
            {
                if(page>allPage)
                    page=allPage;
                if(page<1)
                    page=1;
                res.redirect('/page/'+page);
            }
            else {
                var productChuck = initPage(page, docs);
                var arrPage = createArrPage(docs, null, page);
                res.render('index', {
                    title: 'eShop',
                    products: productChuck,
                    pages: arrPage,
                    loai: result,
                    current_cate: 'Toàn bộ sản phẩm',
                    user: req.user
                });
            }
        });
    });
});

/*--------------------Trang hiển thị sản phẩm theo loại---------------------------*/
router.get("/category/loai/:id",function (req,res,next) {
    var currentpage = '/category/loai/'+req.params.id;
    Loai.find(function (err,result) {
        Product.find({loai:req.params.id},function (err,docs) {
            Loai.findOne({_id:req.params.id},function (err,result1) {
                var productChuck = initPage(1,docs);
                var arrPage = createArrPage(docs,currentpage,1);
                res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:result1.ten,user:req.user});
            });
        });
    });
});


//Xử lý chuyển trang
router.get("/category/loai/:id/page/:number",function (req,res,next) {
    var currentpage = '/category/loai/'+req.params.id;
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find({loai:req.params.id},function (err,docs) {
            Loai.findOne({_id:req.params.id},function (err,result1) {
                var allPage = countPage(docs);
                if(page > allPage || page <1)
                {
                    if(page>allPage)
                        page=allPage;
                    if(page<1)
                        page=1;
                    res.redirect(currentpage+'/page/'+page);
                }
                else
                {
                    var productChuck = initPage(page,docs);
                    var arrPage = createArrPage(docs,currentpage,page);
                    res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:result1.ten,user:req.user});
                }
            });
        });
    });
});

/*--------------------------------Trang sản phẩm hiển thị theo giá tiền tăng giảm---------------------------*/
router.get("/category/sort/inc",function (req,res,next) {
    var currentpage = '/category/sort/inc';
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,currentpage,1);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Giá tiền tăng dần',user:req.user});
        });
    });
});

router.get("/category/sort/dec",function (req,res,next) {
    var currentpage = '/category/sort/dec';
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var productChuck = initPage(1,docs);
            var arrPage = createArrPage(docs,currentpage,1);
            res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result,current_cate:'Giá tiền giảm dần',user:req.user});
        });
    });
});

// xử lý chuyển trang
router.get("/category/sort/inc/page/:number",function (req,res,next) {
    var currentpage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:1}).exec(function (err,docs) {
            var allPage = countPage(docs);
            if (page > allPage || page < 1) {
                if (page > allPage)
                    page = allPage;
                if (page < 1)
                    page = 1;
                res.redirect(currentpage + '/page/' + page);
            }
            else {
                var productChuck = initPage(page, docs);
                var arrPage = createArrPage(docs, currentpage, page);
                res.render('index', {
                    title: 'eShop',
                    products: productChuck,
                    pages: arrPage,
                    loai: result,
                    current_cate: 'Toàn bộ sản phẩm',
                    user: req.user
                });
            } });
    });
});
router.get("/category/sort/dec/page/:number",function (req,res,next) {
    var currentpage = '/category/sort/dec';
    var page = req.params.number;
    Loai.find(function (err,result) {
        Product.find().sort({gia:-1}).exec(function (err,docs) {
            var allPage = countPage(docs);
            if(page > allPage || page <1)
            {
                if(page>allPage)
                    page=allPage;
                if(page<1)
                    page=1;
                res.redirect(currentpage+'/page/'+page);
            }
            else {
                var productChuck = initPage(page, docs);
                var arrPage = createArrPage(docs, currentpage, page);
                res.render('index', {
                    title: 'eShop',
                    products: productChuck,
                    pages: arrPage,
                    loai: result,
                    current_cate: 'Toàn bộ sản phẩm',
                    user: req.user
                });
            } });
    });
});

/*------------------------------Tìm kiếm sản phẩm---------------------------------*/
router.get("/search",function (req,res) {
    var input = change_alias(req.query.search);
    var id = req.query.advance;
    var currentpage = '/search/'+input;
        Loai.find(function (err,result1) {
            const regex = new RegExp(escapeRegex(input), 'gi');
            Product.find({tenTimKiem: regex}, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    if(id != "All")
                    {
                        for(var i=0;i<result.length;i++)
                        {
                            if(result[i].loai != id)
                            {
                                result.splice(i,1);
                                i--;
                            }
                        }
                    }
                    var productChuck = initPage(1,result);
                    var arrPage = createArrPage(result,currentpage,1);
                    res.render('index', { title: 'eShop',products:productChuck,pages:arrPage,loai:result1,current_cate:'Tất cả kết quả về '+req.query.search,user:req.user,message:req.flash('info')});
                }
            });

        });



});
router.get("/search/:input/page/:number",function (req,res,next) {
    var input = req.params.input;
    var page = req.params.number;
    var currentpage = '/search/'+input;
    Loai.find(function (err,result1) {
        const regex = new RegExp(escapeRegex(input), 'gi');
        Product.find({tenTimKiem: regex}, function(err, result){
            if(err){
                console.log(err);
            } else {
                var allPage = countPage(result);
                if(page > allPage || page <1)
                {
                    if(page>allPage)
                        page=allPage;
                    if(page<1)
                        page=1;
                    res.redirect(currentpage+'/page/'+page);
                }
                else {
                    var productChuck = initPage(page, result);
                    var arrPage = createArrPage(result, currentpage, page);
                    res.render('index', {
                        title: 'eShop',
                        products: productChuck,
                        pages: arrPage,
                        loai: result1,
                        current_cate: 'Toàn bộ sản phẩm',
                        user: req.user,
                        message: req.flash('info')
                    });

                }}
        });

    });

});

router.get("/error",function (req,res,next) {
    Loai.find(function (err,result) {
        res.render('error', {message: req.flash('info'),user:req.user,loai:result});
    });
});





/*-----------------Test -----------------------*/



router.get("/todolist",function (req,res,next) {
    Loai.find(function (err,result) {
        res.render('toDolist', {title:'eShop - Bảng chức năng',message: req.flash('info'),user:req.user,loai:result});
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

module.exports = router;
