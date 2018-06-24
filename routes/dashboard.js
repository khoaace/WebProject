var express = require('express');
var router = express.Router();

var Product =  require('../models/product');
var Loai = require('../models/loai');
var User  = require('../models/user');
var Order = require('../models/donhang');

var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/*-----------------------------------Xác thực tài khoản----------------------------*/
/*router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.session.token;
    //req.body.token || req.query.token || req.headers['x-access-token']
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'verysecret', function(err, decoded) {
            if (err) {
                req.flash('info','Xác thực không thành công.');
                res.redirect('/error');
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                if (decoded.mod || decoded.admin)
                    next();
                else {
                    req.flash('info', 'Bạn không có quyền truy cập vào trang này.');
                    res.redirect('/error');
                }
            }
        });
    } else {
        // if there is no token
        // return an error
        req.flash('info','Chưa thực hiện đăng nhập.');
        res.redirect('/error');
    }
});*/

router.get("/",function (req,res,next) {
    res.render('dashboard',{layout:'dashboard_layout',user:req.user});
});


/*--------------------------------Trang sản phẩm ------------------------------------*/

router.get("/product",function (req,res,next) {
    Loai.find(function (err,loai) {
        console.log(err);
        var curentPage = '/dashboard/product';
        Product.find(function (err, product) {
            var size = product.length;
            var productChuck = initPage(1, product);
            var arrPage = createArrPage(product, curentPage,1);
            res.render('product/product-list', {
                title: 'Dashboard-Toàn bộ sản phẩm',
                products: productChuck,
                pages: arrPage,
                Table_name: 'Toàn bộ sản phẩm',
                product_count: size,
                layout: 'dashboard_layout',
                loai:loai,
                message: req.flash('info'),user:req.user
            });
        });
    });
});


router.get('/product/page/:number',function (req,res,next) {
    var page = parseInt(req.params.number);
    Loai.find(function (err,loai) {
        var currentpage = '/dashboard/product';
        Product.find(function (err, product) {
            var allPage = countPage(product);
            if(page > allPage || page <1)
            {
                if(page>allPage)
                    page=allPage;
                if(page<1)
                    page=1;
                res.redirect(currentpage+'/page/'+page);
            }
            else {
                var size = product.length;
                var productChuck = initPage(page, product);
                var arrPage = createArrPage(product, currentpage, page);
                res.render('product/product-list', {
                    title: 'Dashboard-Toàn bộ sản phẩm',
                    products: productChuck,
                    pages: arrPage,
                    Table_name: 'Toàn bộ sản phẩm',
                    product_count: size,
                    layout: 'dashboard_layout',
                    loai: loai,
                    message: req.flash('info'), user: req.user
                });
            } });
    });
});

/*--------------------------------------------Xem sản phẩm theo loại-----------------------------------------*/
router.get("/product/category/:id",function (req,res,next) {
    var id = req.params.id;
    Loai.find(function (err, loai1) {
        Loai.findOne({_id: id}, function (err, loai2) {
            Product.find({loai: id}, function (err, product) {
                var currentPage = '/dashboard/product/category/' + id;
                var size = product.length;
                var productChuck = initPage(1, product);
                var arrPage = createArrPage(product, currentPage,1);
                res.render('product/product-list', {
                    title: 'DashBoard-' + loai2.ten,
                    products: productChuck,
                    pages: arrPage,
                    Table_name: loai2.ten,
                    product_count: size,
                    layout: 'dashboard_layout',
                    loai: loai1,
                    message: req.flash('info'),user:req.user
                });
            });
        });
    });
});

router.get("/product/category/:id/page/:number", function (req, res, next) {
    var id = req.params.id;
    var page = parseInt(req.params.number);
    console.log(page);
    Loai.find(function (err, loai1) {
        Loai.findOne({_id: id}, function (err, loai2) {
            var currentPage = '/dashboard/product/category/' + id;
            Product.find({loai: id}, function (err, product) {
                var allPage = countPage(product);
                if(page > allPage || page <1)
                {
                    if(page>allPage)
                        page=allPage;
                    if(page<1)
                        page=1;
                    res.redirect(currentPage+'/page/'+page);
                }
                else {
                    var size = product.length;
                    var productChuck = initPage(page, product);
                    var arrPage = createArrPage(product, currentPage, page);
                    res.render('product/product-list', {
                        title: 'DashBoard-' + loai2.ten,
                        products: productChuck,
                        pages: arrPage,
                        Table_name: loai2.ten,
                        product_count: size,
                        layout: 'dashboard_layout',
                        loai: loai1,
                        message: req.flash('info'), user: req.user
                    });
                }});
        });
    });
});


/*------------------------------------Chỉnh sửa sản phẩm----------------------------------------------*/

router.get('/product/edit/:id',function (req,res) {
    var id = req.params.id;

    Product.findOne({_id:id},function (err,product) {
        res.render('product/product-edit',{title:'Dashboard-'+product.ten,product:product,layout:'dashboard_layout',message: req.flash('info'),user:req.user});
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
    var tenTimKiem =change_alias(ten);
    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;
    var mmota = req.body.mota;
    var hinhanh = req.body.hinhanh;
    Product.where({_id:id}).update({ten: ten,
        gia: gia,
        tenTimKiem:tenTimKiem,
        nhanhieu: nhanhieu,
        xuatxu: xuatxu,
        hinhanh: hinhanh,
        mota: mmota}).exec(function (err, results) {
    });
    res.redirect('/dashboard/product/edit/'+id+'/success');
});

/*--------------------------------------Thêm sản phẩm mới------------------------------------*/
/*okey*/
router.get('/product/add', function(req, res, next) {
    Loai.find(function (err,loai) {
        if (loai.length == 0)
        {
            req.flash('info',['alert-warning','Không tồn tại LOẠI SẢN PHẨM nào, cần tạo LOẠI SẢN PHẨM trước']);
            res.redirect('/dashboard/category');
        }
        else{
            res.render('product/product-add',{title:'Dashboard-Thêm sản phẩm mới',loai:loai,message: req.flash('info'),layout:'dashboard_layout',user:req.user});
        }
    });
});

/*okey */
router.post("/product/add",urlencodedParser,function (req,res) {
    var errmsg = false;
    console.log("cec");
    var ten = req.body.ten;
    var tenTimKiem = change_alias(ten);
    if (ten === undefined || ten == "")
    {
        res.status(400).send('err');
        return;
    }

    var nhanhieu = req.body.nhanhieu;
    var xuatxu = req.body.xuatxu;
    var gia = req.body.gia;

    if (gia === undefined || gia == "")
    {
        res.status(400).send('err');
        return;
    }
    var mota = req.body.mota;
    var hinhanh = req.body['hinhanh[]'];

    if (hinhanh === undefined || hinhanh.length == 0 )
    {
        res.status(400).send('err');
        return;
    }


    if(mota.trim() === "")
        mota="Không có mô tả";
    //Product.findOne(function (err,result1) {
    //Sau khi kiểm tra xong tiến hành lưu
    Loai.findOne({ten: req.body.loai}, function (err, loai) {
        if (loai == null)
        {
            req.flash('info',['alert-warning','Không tồn tại LOẠI SẢN PHẨM nào, cần tạo LOẠI SẢN PHẨM trước']);
            res.send('no');
        }
        else{
            var product = new Product({
                ten: ten,
                tenTimKiem:tenTimKiem,
                gia: gia,
                loai: loai,
                nhanhieu: nhanhieu,
                xuatxu: xuatxu,
                hinhanh: hinhanh,
                mota: mota
            });
            product.save(function (err, result) {
                res.send('okey');
            });
        }

    });
    //});

});

/*----------------------------------------------Xoá sản phẩm--------------------------------*/
/*okey*/
router.post('/product/delete',function (req,res,next) {

    var id = req.body.id;
    console.log(id);

    if (id === undefined || id == "")
    {
        res.status(400).send('form err');
        return;
    }

    Product.findOne({_id:id},function (err,result) {
        if (err)
        {
            res.status(409).send('cannot delete');
            return;
        }
        else{
            result.remove(function(){

                res.send('done');
            });
        }
    });

});

// Xoá nhiều sản phẩm
/*okey*/
router.post('/product/select-delete',urlencodedParser,function (req,res,next) {
    var checkif_array_or_object = req.body['checkbox[]'];

    if (checkif_array_or_object ==  null)
    {
        res.status(400).send('err not ticked');
    }
    else if (checkif_array_or_object.constructor === Array)
    {
        var arr = checkif_array_or_object;
        if(arr != null)
        {
            for(var i=0;i<arr.length;i++) {
                Product.deleteOne({_id:arr[i]}, function (err, result1) {

                });
            }

            res.status(200).send('Đã xoá '+arr.length+' sản phẩm');
        }
    }
    else
    {
        id = checkif_array_or_object;
        Product.deleteMany({loai:id},function (err,result) {
            res.status(200).send('Xoá thành công');
        });
    }
});

/*------------------Tìm kiếm sản phẩm-------------------------------*/
router.get("/product/search",function (req,res,next) {
    var input = change_alias(req.query.search);
    Loai.find(function (err,loai) {
        var currentpage = '/dashboard/product/search/'+input;
        const regex = new RegExp(escapeRegex(input), 'gi');
        Product.find({tenTimKiem: regex}, function(err, product){
            if(err){
                console.log(err);
            } else {
                var size= product.length;
                var productChuck = initPage(1,product);
                var arrPage = createArrPage(product,currentpage,1);
                res.render('product/product-list', {
                    title: 'Dashboard-Toàn bộ sản phẩm',
                    products: productChuck,
                    pages: arrPage,
                    Table_name: 'Toàn bộ sản phẩm',
                    product_count: size,
                    layout: 'dashboard_layout',
                    loai:loai,
                    message: req.flash('info'),user:req.user
                });
            }
        });
    });
});

router.get("/product/search/:input/page/:number",function (req,res,next) {
    var input = req.params.input;
    var page = req.params.number;
    Loai.find(function (err,loai) {
        var currentpage = '/dashboard/product/search/'+input;
        const regex = new RegExp(escapeRegex(input), 'gi');
        Product.find({tenTimKiem: regex}, function(err, product){
            if(err){
                console.log(err);
            } else {
                var allPage = countPage(product);
                if(page > allPage || page <1)
                {
                    if(page>allPage)
                        page=allPage;
                    if(page<1)
                        page=1;
                    res.redirect(currentpage+'/page/'+page);
                }
                else {
                    var size = product.length;
                    var productChuck = initPage(page, product);
                    var arrPage = createArrPage(product, currentpage, page);
                    res.render('product/product-list', {
                        title: 'Dashboard-Toàn bộ sản phẩm',
                        products: productChuck,
                        pages: arrPage,
                        Table_name: 'Toàn bộ sản phẩm',
                        product_count: size,
                        layout: 'dashboard_layout',
                        loai: loai,
                        message: req.flash('info'), user: req.user
                    });
                }}
        });
    });
});

/*------------------------------Hiển thị loại sản phẩm-----------------------*/

router.get('/category',function (req,res,next) {
    Loai.find(function (err,loai) {
        var curentPage = '/dashboard/category';

        var size = loai.length;
        var productChuck = initPage(1, loai);
        var arrPage = createArrPage(loai, curentPage,1);
        res.render('product/category-list', {
            title: 'Dashboard-Loại sản phẩm',
            loai: productChuck,
            pages: arrPage,
            loai_count: size,
            layout: 'dashboard_layout',
            message: req.flash('info'),user:req.user
        });
    });
});


router.get('/category/page/:number',function (req,res,next) {
    var page = parseInt(req.params.number);
    console.log(page);
    Loai.find(function (err,loai) {
        var currentpage = '/dashboard/category';
        var allPage = countPage(loai);
        if(page > allPage || page <1)
        {
            if(page>allPage)
                page=allPage;
            if(page<1)
                page=1;
            res.redirect(currentpage+'/page/'+page);
        }
        else {
            var size = loai.length;
            var productChuck = initPage(page, loai);
            var arrPage = createArrPage(loai, currentpage, page);
            res.render('product/category-list', {
                title: 'Dashboard-Loại sản phẩm',
                loai: productChuck,
                pages: arrPage,
                loai_count: size,
                layout: 'dashboard_layout',
                message: req.flash('info'),
                user:req.user
            });
        }});
});
/*------------------------------Thêm loại sản phẩm mới------------------------------*/
/*okey*/
router.post('/category/add',urlencodedParser,function (req,res,next) {

    var ten = req.body.ten;
    var tenTimKiem = change_alias(ten);
    if (ten == "")
    {
        res.status(400).send('no name');
        return;
    }

    var loai = new Loai({
        ten: ten,
        tenTimKiem:tenTimKiem
    });

    loai.save(function (err, result) {
        //req.flash('info',['alert-success','Thêm mới thành công.']);
        //res.redirect('/dashboard/category');
        res.send('okey');
    });
});
/*------------------------------Xoá loại sản phẩm----------------------------------*/
/*bỏ*/
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
router.post('/category/delete',function (req,res,next) {
    var id = req.body.id;

    Product.deleteMany({loai:id},function (err,result) {
        if (err)
        {
            res.status(409).send('delete many failed');
            return;
        }
        else {
            Loai.deleteOne({_id:id},function (err,result1) {
                if (err)
                {
                    res.status(409).send('delete GENRES failed');
                    return;
                }
                else{
                    res.send('/dashboard/category/');
                }
            });
        }

    });
});

/*okey*/
router.post('/category/select-delete',urlencodedParser,function (req,res,next) {
    var checkif_array_or_object = req.body['checkbox[]'];

    if (checkif_array_or_object ==  null)
    {
        res.status(400).send('err not ticked');
    }
    else if (checkif_array_or_object.constructor === Array)
    {
        var arr = checkif_array_or_object;
        if(arr != null)
        {
            for(var i=0;i<arr.length;i++) {
                Product.deleteMany({loai:arr[i]},function (err,result) {
                });
                Loai.deleteOne({_id:arr[i]}, function (err, result1) {

                });
            }

            res.status(200).send('Đã xoá '+arr.length+' loại sản phẩm');
        }
    }
    else
    {
        id = checkif_array_or_object;
        Product.deleteMany({loai:id},function (err,result) {
            Loai.deleteOne({_id:id},function (err,result1) {
                res.status(200).send('Xoá thành công');
            });
        });
    }


});

/*--------------------------------Sửa loại sản phẩm-----------------------------------*/
/* okey */
router.post('/category/edit',urlencodedParser,function (req,res,next) {
    var id = req.body.id;
    var ten = req.body.ten;
    var tenTimKiem = change_alias(ten);
    var msg = {'ten': ""};
    Loai.where({_id:id}).update({ten:ten, tenTimKiem:tenTimKiem}).exec(function (err,result) {
        if (err)
        {
            msg.ten = ten;

            res.status(400).send(msg);
            return;
        }
        else{
            msg.ten = req.body.ten;
            res.status(200).send(msg);
        }
    });
});

/*--------------------------Tìm kiếm loại sản phẩm-----------------------------------*/
router.get('/category/search',function (req,res,next) {
    var input = change_alias(req.query.search);
    var currentpage = '/dashboard/category/search/'+input;
    const regex = new RegExp(escapeRegex(input), 'gi');
    Loai.find({tenTimKiem: regex},function (err,loai) {
        var size = loai.length;
        var productChuck = initPage(1, loai);
        var arrPage = createArrPage(loai, currentpage,1);
        res.render('product/category-list', {
            title: 'Dashboard - Loại sản phẩm',
            loai: productChuck,
            pages: arrPage,
            loai_count: size,
            layout: 'dashboard_layout',
            message: req.flash('info'),
            user:req.user
        });
    });
});

router.get('/category/search/:input/page/:number',function (req,res,next) {
    var input = req.params.input;
    var page = req.params.number;
    var currentpage = '/dashboard/category/search/'+input;
    const regex = new RegExp(escapeRegex(input), 'gi');
    Loai.find({tenTimKiem: regex},function (err,loai) {
        var allPage = countPage(loai);
        if(page > allPage || page <1)
        {
            if(page>allPage)
                page=allPage;
            if(page<1)
                page=1;
            res.redirect(currentpage+'/page/'+page);
        }
        else {
            var size = loai.length;
            var productChuck = initPage(1, loai);
            var arrPage = createArrPage(loai, currentpage, 1);
            res.render('product/category-list', {
                title: 'Dashboard-Loại sản phẩm',
                loai: productChuck,
                pages: arrPage,
                loai_count: size,
                layout: 'dashboard_layout',
                message: req.flash('info'),
                user:req.user
            });
        }});
});


/*-------------------------------Phát sinh sản phẩm------------------------------------*/
/*okey*/
router.get('/product/generate',function (req,res,next) {
    Loai.find(function (err,loai) {
        res.render('product/product-generate', {
            loai: loai,
            title:'Dashboard - Phát sinh sản phẩm',
            layout: 'dashboard_layout',
            message: req.flash('info'),
            user:req.user
        })
    });
});
/*okey*/
router.post('/product/generate',function (req,res,next) {
    var loai = req.body.loai;
    var count = parseInt(req.body.count);

    res.charset = 'UTF-8';

    if(count == undefined || count <= 0)
    {
        var resmsg = "/dashboard/category";
        res.status(400).send(resmsg);
        return;
    }

    Loai.findOne({_id:loai},function (err,loai) {
        if (loai == null)
        {
            console.log('err');
            res.status(404).send("/dashboard/category");
            return;
        }
        else{
            var products=[];
            for(var j=0;j < count;j++)
            {
                products.push(new Product({
                    ten: "Zô Bốt Tét",
                    tenTimKiem:"zo bot tet",
                    gia: 50000,
                    loai: loai,
                    nhanhieu: "Robot dỏm",
                    xuatxu: "Việt Nam",
                    hinhanh: ["/images/robot.jpg", "/images/robot.jpg"]
                }));
            }
            for (var i = 0; i < products.length; i++) {
                products[i].save(function (err, docs) {
                });
            }
            //req.flash('info',['alert-success','Phát sinh thành công '+count+' sản phẩm loại '+result.ten]);
            res.send('Phát sinh thành công '+count+' sản phẩm loại '+loai.ten);
        }
    });

});

/*--------------------------Trang quản lý thành viên-------------------------*/

router.get('/user',isAdmin,function (req,res,next) {
    var curentPage = '/dashboard/user';
    User.find(function (err,user) {
        var userChuck = initPage(1, user);
        var arrPage = createArrPage(user, curentPage,1);
        res.render('user/user-list', {
            users:userChuck,
            title:'Dashboard - Quản lý thành viên',
            users_count:user.length,
            pages: arrPage,
            layout: 'dashboard_layout',
            message: req.flash('info'),
            user:req.user
        })
    });
});


router.get('/user/page/:id',isAdmin,function (req,res,next) {
    var page = req.params.number;
    var curentPage = '/dashboard/user';
    User.find(function (err,user) {
        var allPage = countPage(user);
        if(page > allPage || page <1)
        {
            if(page>allPage)
                page=allPage;
            if(page<1)
                page=1;
            res.redirect(curentPage+'/page/'+page);
        }
        else {
            var userChuck = initPage(page, user);
            var arrPage = createArrPage(user, curentPage, page);
            res.render('user/user-list', {
                users: userChuck,
                title: 'Dashboard - Quản lý thành viên',
                users_count: user.length,
                pages: arrPage,
                layout: 'dashboard_layout',
                message: req.flash('info'),
                user: req.user
            })
        }
    });
});


/*------------------------chỉnh sửa thành viên------------------------------*/
router.post('/user/editprofile-admin',isAdmin,urlencodedParser,function (req,res,next) {
    var gender;
    var mod=false;
    if(req.body.gender == 'None')
        gender = req.body.genderbackup;
    else
        gender = req.body.gender;
    if(req.body.mod == 'None')
    {
        if(req.body.modbackup == 'yes')
            mod=true;
    }
    else
    {
        if(req.body.mod == 'yes')
            mod=true;
    }

    if(req.body.password.trim() == "")
    {
        User.where({_id: req.body.id}).update({
            email:req.body.email,
            fullname: req.body.fullname,
            gender: gender,
            birthDay: req.body.birthday,
            mod:mod
        }).exec(function (err, doc) {
        });
    }
    else
    {
        var user = new User();
        var password = user.generateHash(req.body.password);
        User.where({_id: req.body.id}).update({
            password:password,
            email:req.body.email,
            fullname: req.body.fullname,
            gender: gender,
            birthDay: req.body.birthday,
            mod:mod
        }).exec(function (err, doc) {
        });
    }
    req.flash('info', ['alert-success', 'Cập nhật thông tin thành công.']);
    res.redirect('/dashboard/user');
});

/*----------------------------------Xoá thành viên--------------------------*/
router.get('/user/delete/:id',isAdmin,function (req,res,next) {
    var id = req.params.id;
    User.findOne({_id:id},function (err,result) {
        if(result.admin)
        {
            req.flash('info',['alert-danger','Không thể xoá tài khoản này.']);
        }
        else
        {
            User.deleteOne({_id:id},function (err,result) {
            });
            req.flash('info',['alert-success','Đã xoá thành viên.']);
        }
        res.redirect('/dashboard/user');
    });

});

router.post('/user/select-delete',isAdmin,urlencodedParser,function (req,res,next) {
    var checkif_array_or_object = req.body.checkbox;
    var error=false;
    if (checkif_array_or_object ==  null)
    {
        req.flash('info', ['alert-warning', 'Chưa chọn thành viên']);
        res.redirect('/dashboard/user/');
    }
    else if (checkif_array_or_object.constructor === Array)
    {
        var arr = checkif_array_or_object;
        if(arr != null)
        {
            for(var i=0;i<arr.length;i++) {
                User.findOne({_id:arr[i]},function (err,result) {
                    if(result.admin)
                    {
                        error=true;
                    }
                });
            }
            if(!error) {
                for(var i=0;i<arr.length;i++) {
                    Loai.deleteOne({_id: arr[i]}, function (err, result1) {
                    });
                    req.flash('info', ['alert-success', 'Đã xoá ' + arr.length + ' thành viên']);
                    res.redirect('/dashboard/user/');
                }
            }
            else
            {
                req.flash('info',['alert-danger','Lỗi!!! Danh sách chứa thành viên không thể xoá.']);
                res.redirect('/dashboard/user/');
            }
        }
    }
    else
    {
        id = checkif_array_or_object;
        User.findOne({_id:id},function (err,result) {
            if(result.admin)
            {
                req.flash('info',['alert-danger','Lỗi!!! Danh sách chứa thành viên không thể xoá.']);
                res.redirect('/dashboard/user/');
            }
            else {
                Loai.deleteOne({_id: id}, function (err, result1) {
                    req.flash('info', ['alert-success', 'Xoá thành công.']);
                    res.redirect('/dashboard/user/');
                });
            }
        });
    }

});

/*------------------tìm kiếm thành viên----------------------------------*/

router.get('/user/search',isAdmin,function (req,res,next) {
    var input = change_alias(req.query.search);
    var currentpage = '/dashboard/user/search/'+input;
    const regex = new RegExp(escapeRegex(input), 'gi');
    User.find({username: regex},function (err,user) {
        var userChuck = initPage(1, user);
        var arrPage = createArrPage(user, currentpage,1);
        var size= user.length;
        res.render('user/user-list', {
            users:userChuck,
            title:'Dashboard - Quản lý thành viên',
            users_count:user.length,
            pages: arrPage,
            layout: 'dashboard_layout',
            size:size,
            message: req.flash('info'),
            user:req.user
        })
    });
});

router.get('/user/search/:input/page/:number',isAdmin,function (req,res,next) {
    var input = req.params.input;
    var page= req.params.number;
    var currentpage = '/dashboard/user/search/'+input;
    const regex = new RegExp(escapeRegex(input), 'gi');
    User.find({username: regex},function (err,user) {
        var allPage = countPage(user);
        if(page > allPage || page <1)
        {
            if(page>allPage)
                page=allPage;
            if(page<1)
                page=1;
            res.redirect(currentpage+'/page/'+page);
        }
        else {
            var userChuck = initPage(page, user);
            var arrPage = createArrPage(user, currentpage, page);
            var size = user.length;
            res.render('user/user-list', {
                users: userChuck,
                title: 'Dashboard - Quản lý thành viên',
                users_count: user.length,
                pages: arrPage,
                layout: 'dashboard_layout',
                size: size,
                message: req.flash('info'),
                user: req.user
            })
        }});
});
/*--------------------------->Đơn Hàng, Thống Kê<-------------------------------------------*/

router.get("/order/generate", function(){
    var randomproducts = [];
    var prices = [];
    var randomproductnumber = parseInt(Math.random() * 9) + 1; //ngẫu nhiên 1 giá trị từ 1->10
   
    Product.findRandom({}, {}, {limit: randomproductnumber},function (err, result){
        
        for (var i = 0; i < result.length; i++) {
            var whatID = result[i]._id;
            var whatPrice = result[i].gia;
            randomproducts.push(whatID);
            prices.push(whatPrice);
        }


        var neworder = new Order({
            tenkhachhang: "Lê Trí Khoa",
            sodienthoai: '0123456789',
            diachinhanhang: "227, Nguyễn Văn Cừ",
            thanhtoan: "COD",
            trangthai: "Chưa Xử Lý",
            sanpham: randomproducts,
            gia: prices,
            ngaygio: Date(),
            ghichu: "đơn hàng phát sinh tự động"
        });

        console.log(neworder);

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
/*-------------------------------->Đơn Hàng<-------------------------------------------*/
/* generate đơn hàng -okey-*/
router.get("/order/generate", function(req,res){
    for(var loop = 0; loop < 20; loop++)
    {
        var randomproducts = [];
        var randomval = []
        var prices = [];
        var randomproductnumber = parseInt(Math.random() * 3) + 1; //ngẫu nhiên 1 giá trị từ 1->10
    
        Product.findRandom({}, {}, {limit: randomproductnumber},function (err, result){
            
            for (var i = 0; i < result.length; i++) {
                var whatID = result[i]._id;
                var whatPrice = result[i].gia;
                randomproducts.push(whatID);
                prices.push(whatPrice);
                randomval.push(parseInt(Math.random() * 2) + 1);
            }


            var neworder = new Order({
                tenkhachhang: "Lê Trí Khoa",
                sodienthoai: '0123456789',
                diachinhanhang: "227, Nguyễn Văn Cừ",
                thanhtoan: "COD",
                trangthai: "Chưa Xử Lý",
                sanpham: randomproducts,
                soluong: randomval,
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
    }
    res.redirect('/dashboard/order/');
    return;
});

/*okey*/
router.get("/order",function (req,res,next) {
    var link = '/dashboard/order/by/ngaygio' + '/page/1';
    res.redirect(link);
    return;
});

/*okey*/
router.get('/order/by/:sortby/page/:number',function (req,res,next) {
        var page = req.params.number;
        var sortby = String(req.params.sortby);

        var curentPage = '/dashboard/order/by/' + sortby;
        Order.find({}).sort([[sortby, -1]]).exec(function (err, orders) {
            if(err)
            {
                return;
            }
            var orderspara = [];
            var donhangchuaxuly = 0;
            
            for (i = 0; i < orders.length; i++)
            {
                var thisOrder = orders[i];

                var linecolor = "";
                var sumBill = 0;
                var dateformat;

                switch(thisOrder.trangthai) {
                    case "Chưa Xử Lý":
                    {
                        linecolor = "warning";
                        donhangchuaxuly++;
                    }
                        break;
                    case "Đang Giao":
                    linecolor = "info";
                        break;
                    case "Thành Công":
                    linecolor = "success";
                        break;
                    case "Hủy":
                        linecolor = "danger";
                        break;
                    default:
                    linecolor = "active";
                }
                
                for (var j = 0; j < thisOrder.sanpham.length; j++)
                {
                    sumBill += thisOrder.gia[j] * thisOrder.soluong[j];
                }

                dateformat = thisOrder.ngaygio.toLocaleString();
                
                var orderspara_element = {
                    trangthai_color: linecolor,
                    trangthai: thisOrder.trangthai,
                    _id : thisOrder['_id'],
                    soluongsp : thisOrder.sanpham.length,
                    ngaygio : dateformat,
                    tongtien : sumBill
                }
                
                orderspara.push(orderspara_element);
                if (sortby == 'tongtien')
                {
                    orderspara.sort((a, b) => Number(a.tongtien) - Number(b.tongtien));
                }
                if (sortby == 'sp')
                {
                    orderspara.sort((a, b) => Number(a.soluongsp) - Number(b.soluongsp));
                }
            }

            var ordersChuck = initPage(page, orderspara);
            var arrPage = createArrPage(orderspara, curentPage,page);

            res.render('product/order-list', {
                title: 'Dashboard-Quản lý đơn hàng',
                order: ordersChuck,
                pages: arrPage,
                orders_count: donhangchuaxuly,
                layout: 'dashboard_layout'
            });
        });
});

/*--------------------------------------------theo trạng thái-----------------------------------------*/
/*okey*/
router.get("/order/state/:state",function (req,res,next) {
    var link = '/dashboard/order/state/' + req.params.state + '/by/trangthai/page/1';
    res.redirect(link);
    return;
});

/*okey*/
router.get("/order/state/:state/by/:sortby/page/:number", function (req, res, next) {
    var state = req.params.state;
    var sortby = String(req.params.sortby);
    var number = req.params.number;
    var query = "";

    switch (state)
    {
        case 'waiting': {
            query = "Chưa Xử Lý"
        }
        break;
        case 'delivering': {
            query = "Đang Giao"
        }
        break;
        case 'delivered': {
            query = "Thành Công"
        }
        break;
        case 'canceled': {
            query = "Hủy"
        }
        break;
        default: break;
    }
    
    var curentPage = '/dashboard/order/state/' + state + '/by/' + sortby;
    Order.find({trangthai: query}).sort([[sortby, -1]]).exec(function (err, orders) {
        if(err)
        {
            return;
        }
        var orderspara = [];
        var donhangchuaxuly = 0;
        
        for (i = 0; i < orders.length; i++)
        {
            var thisOrder = orders[i];

            var linecolor = "";
            var sumBill = 0;
            var dateformat;

            switch(thisOrder.trangthai) {
                case "Chưa Xử Lý":
                {
                    linecolor = "warning";
                    donhangchuaxuly++;
                }
                    break;
                case "Đang Giao":
                linecolor = "info";
                    break;
                case "Thành Công":
                linecolor = "success";
                    break;
                case "Hủy":
                    linecolor = "danger";
                    break;
                default:
                linecolor = "active";
            }
            
            for (var j = 0; j < thisOrder.sanpham.length; j++)
            {
                sumBill += thisOrder.gia[j] * thisOrder.soluong[j];
            }

            dateformat = thisOrder.ngaygio.toLocaleString();
            
            var orderspara_element = {
                trangthai_color: linecolor,
                trangthai: thisOrder.trangthai,
                _id : thisOrder['_id'],
                soluongsp : thisOrder.sanpham.length,
                ngaygio : dateformat,
                tongtien : sumBill
            }
            
            orderspara.push(orderspara_element);
            if (sortby == 'tongtien')
            {
                orderspara.sort((a, b) => Number(a.tongtien) - Number(b.tongtien));
            }
            if (sortby == 'sp')
            {
                orderspara.sort((a, b) => Number(a.soluongsp) - Number(b.soluongsp));
            }
        }

        var ordersChuck = initPage(number, orderspara);
        var arrPage = createArrPage(orderspara, curentPage,number);


        res.render('product/order-list', {
            title: 'Dashboard-Quản lý đơn hàng',
            order: ordersChuck,
            pages: arrPage,
            orders_count: donhangchuaxuly,
            layout: 'dashboard_layout',
            state: state
        });
    });
});

/*okey*/
router.post('/order/changestate', function(req, res, next){
    var orderId = req.body.id;
    var toState = req.body.toState;
    console.log(toState);
    if (toState === undefined)
    {
        console.log("state swrong");
        res.status(400).send(toState + ' is not an enum');
        return;
    }
    else{
        
        Order.findOne({_id: orderId }, function (err, doc){
            
            if (err || doc == null)
            {
                res.status(404).send('order not founded');
                return;
            }
            else
            {
                console.log(doc);
                doc.trangthai = toState;
                doc.save(function(err){
                    if (err)
                    {
                        res.status(409).send(toState + ' is not an enum');
                    }
                    else
                    {
                        res.send(toState);
                    }
                });
            }
          });
    }    
});
/* ----------------------- ------------------ */
/* query đơn hàng*/
router.post('/order/query', function(req, res, next){
        var orderId = req.body.id;
        Order.findOne({_id: orderId }, function (err, doc){
            if (err)
            {
                res.status(404).send('order not founded');
                return;
            }
            else
            {
                res.send(doc);
            }
          });
});

router.get('/order/query/:id', function(req, res, next){
    var orderId = req.params.id;
    console.log(orderId);
    Order.findOne({_id: orderId }, function (err, doc){
        if (err)
        {
            res.status(404).send('order not founded');
            return;
        }
        else if (doc != null)
        {
            var products = [];
            var thanhtien1mathang = [];
            var tongcong = 0;
            var linecolor;

            switch(doc.trangthai) {
                case "Chưa Xử Lý":
                {
                    linecolor = "warning";
                }
                    break;
                case "Đang Giao":
                linecolor = "info";
                    break;
                case "Thành Công":
                linecolor = "success";
                    break;
                case "Hủy":
                    linecolor = "danger";
                    break;
                default:
                linecolor = "active";
            }
            
            console.log(doc.sanpham.length);
            for (var i = 0; i < doc.sanpham.length; i++)
            {
                var whatid = doc.sanpham[i];
                Product.findOne({_id: whatid}, function(err,doc2){
                    if(err || doc2 == null)
                    {
                    }
                    else
                    {
                        products.push(doc2);
                    }
                });
                var thanhtien = doc.gia[i] * doc.soluong[i];
                thanhtien1mathang.push(thanhtien);
                tongcong += thanhtien;
            }
            
            console.log(products);
            var dateformat = doc.ngaygio.toLocaleString();
            res.render('product/order-detail', {
                tenkhachhang: doc.tenkhachhang,
                sodienthoai: doc.sodienthoai,
                id: doc._id,
                diachi: doc.diachinhanhang,
                ngaynhandon: dateformat,
                ghichu: doc.ghichu,
                sanpham: products,
                soluong: doc.soluong,
                gia: doc.gia,
                thanhtien: thanhtien1mathang,
                trangthai_color: linecolor,
                trangthai: doc.trangthai,

                tongcong: tongcong
            });

        }
      });
});
/*--------------------------------->Thống Kê<------------------------------------------*/
router.get('/statistic', function(req, res, next){
    res.render('product/stat',{layout:'dashboard_layout'});
});

function checkDate(date) {
    return date[0].valueOf() === this.valueOf();
}

function stat_checkproduct(arrayPro) {
    return arrayPro[0].toString() == this.toString();
}

router.post('/statistic/process', function(req, res, next){
    var startDate = new Date(req.body.fromdate);
    var endDate = new Date(req.body.todate);

    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate)
    {
        res.status(400).send('invalid time');
        return;
    }

    var bywhat  = req.body.bywhat;

    endDate.setDate(endDate.getDate() + 1);

    var dssanpham4topdanhmuc = [];

    var topdanhmuc = [];
    var topsanpham = [];
    var doanhthu = [];
    doanhthu.push(["thời gian", "Doanh Thu"]);
    for (var i = new Date(startDate); i < endDate; i.setDate(i.getDate() + 1))
    {
        doanhthu.push([new Date(i), 0]);
    }
   
    var query = {$and: [
        {trangthai: 'Thành Công'},
        {$and: [{ngaygio: {$gte: startDate}},{ngaygio: {$lte: endDate}}]}
    ]};
    Order.find(query).sort([['ngaygio', 1]]).exec(function(err, docs) {
        for (var i = 0; i < docs.length; i++)
        {
            thisOrder = docs[i];
            thisOrderDay = new Date(0);
            thisOrderDay.setFullYear(thisOrder.ngaygio.getFullYear());
            thisOrderDay.setMonth(thisOrder.ngaygio.getMonth());
            thisOrderDay.setDate(thisOrder.ngaygio.getDate());
            
            var element = doanhthu.find(checkDate, thisOrderDay);
            var sumBill = 0;
            if (element != undefined)
            {
                for (var j = 0; j < thisOrder.sanpham.length; j++)
                {
                    sumBill += thisOrder.gia[j] * thisOrder.soluong[j];
                    
                    var sp = topsanpham.find(stat_checkproduct, thisOrder.sanpham[j]);
                    
                    if (typeof sp !== "undefined")
                    {
                        sp[1] += thisOrder.soluong[j];
                    }
                    else
                    {
                        topsanpham.push([thisOrder.sanpham[j], thisOrder.soluong[j]])
                    }
                    
                    dssanpham4topdanhmuc.push(thisOrder.sanpham[j]);
                }
                
                element[1] += sumBill;
            }
        }

        for (var j = 1; j < doanhthu.length; j++)
        {
            var temp = doanhthu[j][0];
            doanhthu[j][0] = temp.toISOString().slice(0,10);
        }

        topsanpham.sort(function(a, b) {
            return b[1] - a[1];
        });

        var topsanpham_clone = topsanpham.slice();

        if (topsanpham.length >= 11)
        {
            while (topsanpham.length > 11)
            {
                var poped = topsanpham.pop();
                topsanpham[10][1] += poped[1];
            }

            topsanpham[10][0] = 'khác';
        }

        var topsanphamquerier = [];
        for (var j = 0; j < topsanpham.length && j < 10; j++)
        {
            var temp = topsanpham[j][0].toString();
            topsanphamquerier.push(temp);
        }
        topsanpham.unshift(['sản phẩm','số lượng hàng bán']);
        
        Product.find({_id: { $in: topsanphamquerier}}, function(err, products){
            Product.find({_id: { $in: dssanpham4topdanhmuc}}, 'loai', function(err, genresofallproducts){
                
                for (var i = 0; i < genresofallproducts.length; i++)
                {
                    var thisProd = genresofallproducts[i];
                    console.log(thisProd);
                    var gen = topdanhmuc.find(stat_checkproduct, thisProd.loai);
                    
                    if (typeof gen !== "undefined")
                    {
                        gen[1] += 1;
                    }
                    else
                    {
                        topdanhmuc.push([thisProd.loai, 1])
                    }
                }
                console.log(topdanhmuc);
                for (var i = 0; i < products.length; i++)
                {
                    var element = topsanpham.find(stat_checkproduct, products[i]._id);

                    if (typeof element !== "undefined")
                        {
                            element[0] = products[i].ten;
                        }
                }

                topdanhmuc.sort(function(a, b) {
                    return b[1] - a[1];
                });
        
                if (topdanhmuc.length >= 11)
                {
                    while (topdanhmuc.length > 11)
                    {
                        var poped = topdanhmuc.pop();
                        topdanhmuc[10][1] += poped[1];
                    }
        
                    topdanhmuc[10][0] = 'khác';
                }

                var topdanhmucquerier = [];
                for (var j = 0; j < topdanhmuc.length && j < 10; j++)
                {
                    var temp = topdanhmuc[j][0].toString();
                    topdanhmucquerier.push(temp);
                }

                Loai.find({_id: { $in: topdanhmucquerier}}, 'ten', function(err, danhmucdocs)
                {
                    for (var j = 0; j < danhmucdocs.length; j++)
                    {
                        var temp  = danhmucdocs[j].ten;
                        topdanhmuc[j][0] = temp;
                    }
                    
                    topdanhmuc.unshift(['Danh mục','số lượng hàng bán']);

                    var resvalue = {
                        'stat_chart': doanhthu,
                        'toppro1': topsanpham,
                        'toppro2':topdanhmuc,
                    };
                    res.send(resvalue);
                });
                
            });
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

function isAdmin(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.user.admin)
        return next();
    // Nếu chưa, đưa về trang chủ
    req.flash('info','Bạn không có quyền truy cập.');
    res.redirect('/error');
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

function stepquery(result, dateIndex, endDate)
{
    if (dateIndex >= endDate)
    {
        return result;
    }
    else {
        var resultElementVal = 0;

        var tomorow = new Date(dateIndex);
        tomorow.setFullYear(dateIndex.getFullYear());
        tomorow.setMonth(dateIndex.getMonth());
        tomorow.setDate(dateIndex.getDate()+1);
        var query = /*{$and: [
            {trangthai: 'Thành Công'},
            {$and: [{ngaygio: {$gte: dateIndex}},{ngaygio: {$lte: tomorow}}]}
        ]
        }*/{trangthai: 'Thành Công', ngaygio: {$lt: tomorow, $gte: dateIndex}};

        Order.find(query, function(err, docs) {
            if (err) {
                console.log(err);
            }
            else 
            {
                //console.log(docs);
                console.log(docs.length);

                for (var bill = 0; bill <docs.length; bill++)
                {
                    var sumBill = 0;
                    var thisOrder = docs[bill];
                    for (var j = 0; j < thisOrder.sanpham.length; j++)
                    {
                        sumBill += thisOrder.gia[j] * thisOrder.soluong[j];
                    }
                    resultElementVal += sumBill;
                }
            }
            console.log("today");
            console.log(dateIndex);
            console.log("romorow");
            console.log(tomorow);
            console.log(result);

            
            var thisDate = dateIndex.toDateString();
            var element = [thisDate, resultElementVal];

            result.push(element);
            console.log(result);
            dateIndex.setDate(dateIndex.getDate() + 1);
            return result;
        });
    }
}

function addDateIndex(i, bywhat)
{
    switch(bywhat) {
        case "year":
        {
            i.setDate(i.get)
        }
            break;
        case "year":
        {
        }
            break;
        case "year":
        {
        }
            break;
        case "year":
        {
        }
            break;
        case "year":
        {
        }
            break;
        default:
        {
        }
            break;
    }
}

module.exports = router;