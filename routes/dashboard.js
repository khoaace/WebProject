var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Loai = require('../models/loai');
var User  = require('../models/user');
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
                message: req.flash('info'),user:req.user
            });
        });
    });
});


router.get('/product/page/:number',function (req,res,next) {
    var page = parseInt(req.params.number);
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
                message: req.flash('info'),user:req.user
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
                        message: req.flash('info'),user:req.user
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
/*okey*/
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

/*bỏ*/
router.get('/product/add/success',function (req,res,next) {
    req.flash('info',['alert-success','Thêm sản phẩm thành công.']);
    res.redirect('/dashboard/product/add/');
});

/*okey */
router.post("/product/add",urlencodedParser,function (req,res) {
    var errmsg = false;

    var ten = req.body.ten;
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
        Loai.findOne({ten: req.body.loai}, function (err, result) {
            if (result == null)
            {
                req.flash('info',['alert-warning','Không tồn tại LOẠI SẢN PHẨM nào, cần tạo LOẠI SẢN PHẨM trước']);
                res.send('no');
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
                    res.send('okey');
                });    
            }
            
        });
    //});

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


router.get('/category/page/:number',function (req,res,next) {
    var page = parseInt(req.params.number);
    console.log(page);
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
/*okey*/
router.post('/category/add',urlencodedParser,function (req,res,next) {

    var ten = req.body.ten;
    
    if (ten == "")
    {
        res.status(400).send('no name');
        return;
    }
    
    var loai = new Loai({
        ten: ten
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
            for(var i=0;i<arr.length;i++) {
                Product.deleteMany({loai:arr[i]},function (err,result) {
                });
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
/* okey */
router.post('/category/edit',urlencodedParser,function (req,res,next) {
    var id = req.body.id;
    var ten = req.body.ten;

    var msg = {'ten': ""};
    console.log(id);
    console.log(ten);
    Loai.where({_id:id}).update({ten:ten}).exec(function (err,result) {
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


/*-------------------------------Phát sinh sản phẩm------------------------------------*/
/*okey*/
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

    Loai.findOne({_id:loai},function (err,result) {
        if (result == null)
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
            //req.flash('info',['alert-success','Phát sinh thành công '+count+' sản phẩm loại '+result.ten]);
            res.send('Phát sinh thành công '+count+' sản phẩm loại '+result.ten);
        }
    });

});

/*--------------------------Trang quản lý thành viên-------------------------*/

router.get('/user',isAdmin,function (req,res,next) {
    var curentPage = '/dashboard/user';
    User.find(function (err,result) {
        var userChuck = initPage(1, result);
        var arrPage = createArrPage(result, curentPage,1);
        res.render('user/user-list', {
            users:userChuck,
            title:'Dashboard - Quản lý thành viên',
            users_count:result.length,
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
    User.find(function (err,result) {
        var userChuck = initPage(page, result);
        var arrPage = createArrPage(result, curentPage,page);
        res.render('user/user-list', {
            users:userChuck,
            title:'Dashboard - Quản lý thành viên',
            users_count:result.length,
            pages: arrPage,
            title:'Dashboard - Quản lý thành viên',
            layout: 'dashboard_layout',
            message: req.flash('info'),
            user:req.user
        })
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



/*--------------------------------->Hàm xử lý<-----------------------------------------*/
function initPage(page,docs) {
    page =(page-1)*12;
    var productChuck=[];
    var count = 0;
    var chucksize = 6; //  1 hàng có 4 sp
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

function isAdmin(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.user.admin)
        return next();
    // Nếu chưa, đưa về trang chủ
    req.flash('info','Bạn không có quyền truy cập.');
    res.redirect('/error');
}
module.exports = router;