var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/",function (req,res,next) {
    res.render('error',{layout:'dashboard_layout'});
});


/*--------------------------------Trang sản phẩm ------------------------------------*/

router.get("/product",function (req,res,next) {
    Loai.find(function (err,result1) {
        var curentPage = '/dashboard/product';
        Product.find(function (err, docs) {
            var size = docs.length;
            var productChuck = initPage(1, docs);
            var arrPage = createArrPage(docs, curentPage,1);
            res.render('product/product-list', {
                title: 'Dashboard-Toàn bộ sản phẩm',
                products: productChuck,
                pages: arrPage,
                Table_name: 'Toàn bộ sản phẩm',
                product_count: size,
                layout: 'dashboard_layout',
                loai:result1,
                message: req.flash('info')
            });
        });
    });
});


router.get('/product/page/:number',function (req,res,next) {
    var page = req.params.number;
    Loai.find(function (err,result1) {
        var curentPage = '/dashboard/product';
        Product.find(function (err, docs) {
            var size = docs.length;
            var productChuck = initPage(page, docs);
            var arrPage = createArrPage(docs, curentPage,page);
            res.render('product/product-list', {
                title: 'Dashboard-Toàn bộ sản phẩm',
                products: productChuck,
                pages: arrPage,
                Table_name: 'Toàn bộ sản phẩm',
                product_count: size,
                layout: 'dashboard_layout',
                loai:result1,
                message: req.flash('info')
            });
        });
    });
});

/*--------------------------------------------Xem sản phẩm theo loại-----------------------------------------*/
router.get("/product/category/:id",function (req,res,next) {
    var id = req.params.id;
    Loai.find(function (err, result1) {
        Loai.findOne({_id: id}, function (err, result2) {
            Product.find({loai: id}, function (err, docs) {
                var currentPage = '/dashboard/product/category/' + id;
                var size = docs.length;
                var productChuck = initPage(1, docs);
                var arrPage = createArrPage(docs, currentPage,1);
                res.render('product/product-list', {
                    title: 'DashBoard-' + result2.ten,
                    products: productChuck,
                    pages: arrPage,
                    Table_name: result2.ten,
                    product_count: size,
                    layout: 'dashboard_layout',
                    loai: result1,
                    message: req.flash('info')
                });
            });
        });
    });
});

    router.get("/product/category/:id/page/:number", function (req, res, next) {
        var id = req.params.id;
        var page = req.params.number;
        Loai.find(function (err, result1) {
            Loai.findOne({_id: id}, function (err, result2) {
                Product.find({loai: id}, function (err, docs) {
                    var currentPage = '/dashboard/product/category/' + id;
                    var size = docs.length;
                    var productChuck = initPage(page, docs);
                    var arrPage = createArrPage(docs, currentPage,page);
                    res.render('product/product-list', {
                        title: 'DashBoard-' + result2.ten,
                        products: productChuck,
                        pages: arrPage,
                        Table_name: result2.ten,
                        product_count: size,
                        layout: 'dashboard_layout',
                        loai: result1,
                        message: req.flash('info')
                    });
                });
            });
        });
    });


/*------------------------------------Chỉnh sửa sản phẩm----------------------------------------------*/

router.get('/product/edit/:id',function (req,res) {
   var id = req.params.id;
    Product.findOne({_id:id},function (err,result) {
            res.render('product/product-edit',{title:'Dashboard-'+result.ten,product:result,layout:'dashboard_layout',message: req.flash('info')});
    });
});
router.get('/product/edit/:id/success',function (req,res,next) {
    var id = req.params.id;
    req.flash('info',['alert-success','Sửa đổi sản phẩm thành công.']);
    res.redirect('/dashboard/product/edit/'+id);
});

router.post("/product/edit/update/",urlencodedParser,function (req,res) {
    var id =  req.body.id;
    var ten = req.body.ten;
    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;
    var mmota = req.body.mota;
    var hinhanh = req.body.hinhanh;
    Product.where({_id:id}).update({ten: ten,
        gia: gia,
        nhanhieu: nhanhieu,
        xuatxu: xuatxu,
        hinhanh: hinhanh,
        mota: mmota}).exec(function (err, results) {
    });
    res.redirect('/dashboard/product/edit/'+id+'/success');
});

/*--------------------------------------Thêm sản phẩm mới------------------------------------*/

router.get('/product/add', function(req, res, next) {
    Loai.find(function (err,result) {
        if (result.length == 0)
        {
            req.flash('info',['alert-warning','Không tồn tại LOẠI SẢN PHẨM nào, cần tạo LOẠI SẢN PHẨM trước']);
            res.redirect('/dashboard/category');
        }
        else{
            res.render('product/product-add',{title:'Dashboard-Thêm sản phẩm mới',loai:result,message: req.flash('info'),layout:'dashboard_layout'});
        }
    });
});

router.get('/product/add/success',function (req,res,next) {
    req.flash('info',['alert-success','Thêm sản phẩm thành công.']);
    res.redirect('/dashboard/product/add/');
});

router.post("/product/add",urlencodedParser,function (req,res) {
    
    var ten = req.body.ten;
    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;
    var mota = req.body.mota;
    var hinhanh = req.body.hinhanh;
    if(mota.trim() === "")
        mota="Không có mô tả";
    kq=hinhanh[0].localeCompare('');
    console.log('check0');
    Product.findOne(function (err,result1) {
        console.log('check1');
        //Sau khi kiểm tra xong tiến hành lưu
        Loai.findOne({ten: req.body.loai}, function (err, result) {
            console.log('check2');
            if (result == null)
            {
                console.log('check3');
                req.flash('info',['alert-warning','Không tồn tại LOẠI SẢN PHẨM nào, cần tạo LOẠI SẢN PHẨM trước']);
                res.redirect('/dashboard/product/add');
            }
            else{
                var product = new Product({
                    ten: ten,
                    gia: gia,
                    loai: result,
                    nhanhieu: nhanhieu,
                    xuatxu: xuatxu,
                    hinhanh: hinhanh,
                    mota: mota
                });
                product.save(function (err, result) {
                    res.redirect('/dashboard/product/add/success');
                });    
            }
            
        });
    });

});

/*----------------------------------------------Xoá sản phẩm--------------------------------*/

router.get('/product/delete/:id',function (req,res,next) {
    var id = req.params.id;
    
    Product.deleteOne({_id:id},function (err,result) {
        req.flash('info',['alert-success','Đã xoá sản phẩm.']);
        res.redirect('/dashboard/product');
    });
});

 // Xoá nhiều sản phẩm
router.post('/product/select-delete',urlencodedParser,function (req,res,next) {
    
    var checkif_array_object = req.body.checkbox;
    
    if(checkif_array_object == null)
    {
        req.flash('info', ['alert-warning', 'Chưa chọn sản phẩm']);
        res.redirect('/dashboard/product');
    }
    else if(checkif_array_object.constructor === Array)
    {
        var arr = checkif_array_object;
        if(arr != null)
        {
            for(var i=0;i<arr.length;i++) {
                Product.deleteOne({_id: arr[i]}, function (err, result) {
                });
            }
            req.flash('info',['alert-success','Đã xoá '+arr.length+' sản phẩm']);
            res.redirect('/dashboard/product');
        }
    }
    else
    {
        var id = checkif_array_object;
        Product.deleteOne({_id:id},function (err,result) {
            req.flash('info',['alert-success','Đã xoá sản phẩm.']);
            res.redirect('/dashboard/product');
        });
    }
});

/*------------------------------Hiển thị loại sản phẩm-----------------------*/
/* okey */
router.get('/category',function (req,res,next) {
    Loai.find(function (err,result1) {
        var curentPage = '/dashboard/category';

            var size = result1.length;
            var productChuck = initPage(1, result1);
            var arrPage = createArrPage(result1, curentPage,1);
            res.render('product/category-list', {
                title: 'Dashboard-Loại sản phẩm',
                loai: productChuck,
                pages: arrPage,
                loai_count: size,
                layout: 'dashboard_layout',
                message: req.flash('info')
            });
    });
});


router.get('/category/page/:id',function (req,res,next) {
    var page = req.params.number;
    Loai.find(function (err,result1) {
        var curentPage = '/dashboard/category';

            var size = result1.length;
            var productChuck = initPage(page, result1);
            var arrPage = createArrPage(result1, curentPage,page);
            res.render('product/category-list', {
                title: 'Dashboard-Loại sản phẩm',
                loai: productChuck,
                pages: arrPage,
                loai_count: size,
                layout: 'dashboard_layout',
                message: req.flash('info')
        });
    });
});

/*------------------------------Thêm loại sản phẩm mới------------------------------*/
/* okey */
router.post('/category/add',urlencodedParser,function (req,res,next) {
    var ten = req.body.ten;
    
    var loai = new Loai({
        ten: ten
    });
    loai.save(function (err, result) {
        req.flash('info',['alert-success','Thêm mới thành công.']);
        res.redirect('/dashboard/category');
    });
});
/*------------------------------Xoá loại sản phẩm----------------------------------*/
/* okey */
router.get('/category/delete/:id',function (req,res,next) {
    var id = req.params.id;
    
    Product.deleteMany({loai:id},function (err,result) {
        Loai.deleteOne({_id:id},function (err,result1) {
            req.flash('info',['alert-success','Xoá thành công.']);
            res.redirect('/dashboard/category/');
        });
    });
});

/*okey*/
router.post('/category/select-delete',urlencodedParser,function (req,res,next) {
    var checkif_array_or_object = req.body.checkbox;

    if (checkif_array_or_object ==  null)
    {
        req.flash('info', ['alert-warning', 'Chưa chọn loại sản phẩm']);
        res.redirect('/dashboard/category/');
    }
    else if (checkif_array_or_object.constructor === Array)
    {
        var arr = checkif_array_or_object;
        if(arr != null)
        {
            console.log(arr.length);
            for(var i=0;i<arr.length;i++) {
                Product.deleteMany({loai:arr[i]},function (err,result) {
                });
                console.log(arr[i]);
                Loai.deleteOne({_id:arr[i]}, function (err, result1) {
                });
            }
            req.flash('info',['alert-success','Đã xoá '+arr.length+' loại sản phẩm']);
            res.redirect('/dashboard/category/');
        }            
    }
    else
    {
        id = checkif_array_or_object;
        Product.deleteMany({loai:id},function (err,result) {
            Loai.deleteOne({_id:id},function (err,result1) {
                req.flash('info',['alert-success','Xoá thành công.']);
                res.redirect('/dashboard/category/');
            });
        });
    }

    
});

/*--------------------------------Sửa loại sản phẩm-----------------------------------*/
router.post('/category/edit',urlencodedParser,function (req,res,next) {
    var id =req.body.id;
    var ten = req.body.ten;
    
    Loai.where({_id:id}).update({ten:ten}).exec(function (err,result) {
    });
    req.flash('info',['alert-success','Chỉnh sửa thành công']);
    res.redirect('/dashboard/category');
});


/*-------------------------------Phát sinh sản phẩm------------------------------------*/
router.get('/product/generate',function (req,res,next) {
    Loai.find(function (err,result) {
       res.render('product/product-generate', {
           loai: result,
           title:'Dashboard - Phát sinh sản phẩm',
           layout: 'dashboard_layout',
           message: req.flash('info')
       })
    });
});
router.post('/product/generate',urlencodedParser,function (req,res,next) {
    var loai = req.body.loai;
    var count =  req.body.count;

    Loai.findOne({_id:loai},function (err,result) {
        if (result == null)
        {
            req.flash('info', ['alert-warning', 'Không tồn tại LOẠI SẢN PHẨM, cần tạo LOẠI SẢN PHẨM trước']);
            res.redirect('/dashboard/category');
        }
        else{
            var products=[];
            for(var j=0;j < count;j++)
            {
                products.push(new Product({
                    ten: "Ghế test",
                    gia: 50000,
                    loai: result,
                    nhanhieu: "Ghế hòa phát",
                    xuatxu: "Việt Nam",
                    hinhanh: ["/images/gheXoay.PNG", "/images/gheChanQuy.png"]
                }));
            }
            for (var i = 0; i < products.length; i++) {
                products[i].save(function (err, docs) {
                });
            }
            req.flash('info',['alert-success','Phát sinh thành công '+count+' sản phẩm loại '+result.ten]);
            res.redirect('/dashboard/product/generate');
        }
    });

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


function createArrPage(docs,currentPage,page) {
    var allPage=1;
    if(docs.length > 8)
    {
        allPage = parseInt( docs.length / 8);
        if((docs.length / 2.0) != 0)
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