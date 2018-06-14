var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var User  = require('../models/user');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var urlencodedParser = bodyParser.urlencoded({ extended: false });



/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function(req, res, next) {
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
});

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
        res.render('product/product-edit',{title:'Dashboard-'+product.ten,product:product,layout:'dashboard_layout',message: req.flash('info')});
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
            res.render('product/product-add',{title:'Dashboard-Thêm sản phẩm mới',loai:loai,message: req.flash('info'),layout:'dashboard_layout'});
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
            message: req.flash('info')
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
            message: req.flash('info')
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
module.exports = router;