module.exports = function (app, passport) {
    var Product =  require('../models/product');
    var Loai = require('../models/loai');
    var User  =require('../models/user');
    var bodyParser = require('body-parser');

    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    var date;

/*----------------------Đăng kí--------------------------*/
    app.get('/signup', function (req, res) {
        Loai.find(function (err, docs) {
            res.render('user/signup', {title:'eShop - Đăng kí',loai: docs,message: req.flash('info')});
        });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // chuyển hướng tới trang được bảo vệ
        failureRedirect: '/signup', // trở lại trang đăng ký nếu có lỗi
        failureFlash: true // allow flash messages
    }));

    app.post('/subscribe',urlencodedParser, function (req, res) {
        Loai.find(function (err, docs) {
            res.render('user/signup', {loai: docs,message: req.flash('info'),email:req.body.email});
        });
    });
/*------------------------------Đăng nhập-------------------------------------*/
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // chuyển hướng tới trang được bảo vệ
        failureRedirect: '/login', // trở lại trang đăng ký nếu có lỗi
        failureFlash: true // allow flash messages
    }));

    app.get('/login',isUnLoggedIn,function (req,res) {
        if(req.user != null)
            res.redirect('/');
        Loai.find(function (err,result) {
            res.render('user/login',{title:'eShop - Đăng nhập',Loai:result,message: req.flash('info')});
        });
    });
  /* --------------------------------- Đăng xuất ----------------------------*/
    app.get('/logout', function (req, res) {
        // create a sample user
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });
/*----------------------------Thông tin cá nhân---------------------------*/
    app.get('/profile', isLoggedIn,function (req, res) {
        res.render('user/profile',{title:'eShop - Profile',user:req.user,message: req.flash('info')});
    });

    app.post('/changepassword',urlencodedParser,isLoggedIn,function (req, res) {
            User.findOne({username:req.user.username},function (err, docs) {
                if(req.body.newpassword != req.body.renewpassword){
                    req.flash('info',['alert-danger','Mật khẩu nhập lại không trùng khớp.']);
                }
                else {
                    if (docs.validPassword(req.body.password)) {
                        var pw = docs.generateHash(req.body.newpassword);
                        User.where({username: req.user.username}).update({password: pw}).exec(function (err, doc) {
                        });
                        req.flash('info', ['alert-success', 'Thay đổi mật khẩu thành công.']);
                    }
                    else {
                        req.flash('info', ['alert-danger', 'Mật khẩu cũ không chính xác.']);
                    }
                }
                res.redirect('/profile');
            });
    });

    app.post('/editprofile',urlencodedParser,isLoggedIn,function (req, res) {
        if(req.body.fullname.trim()=="")
            req.flash('info', ['alert-danger', 'Tên đầy đủ không được để TRỐNG.']);
        else {
            User.where({username: req.user.username}).update({
                fullname: req.body.fullname,
                gender: req.body.gender,
                birthDay: req.body.birthday
            }).exec(function (err, doc) {
            });
            req.flash('info', ['alert-success', 'Cập nhật thông tin thành công.']);
        }
            res.redirect('/profile');
    });




/*-------------------Các hàm hỗ trợ xác thực-------------------------*/
    function isLoggedIn(req, res, next) {
        // Nếu một user đã xác thực, cho đi tiếp
        if (req.isAuthenticated())
            return next();
        // Nếu chưa, đưa về trang chủ
        req.flash('info','Bạn cần đăng nhập trước.');
        res.redirect('/error');
    }

    function isUnLoggedIn(req, res, next) {
        // Nếu một user đã xác thực, cho đi tiếp
        if (req.isUnauthenticated())
            return next();
        // Nếu chưa, đưa về trang chủ
        req.flash('info','Bạn đã đăng nhập. Vui lòng đăng xuất để sử dụng tài khoản khác');
        res.redirect('/error');
    }




// Tạo tài khoản Admin
/*    app.get('/setup', function (req, res) {
        // create a sample user
        var date = new Date();
        var user = new User();
        user.username = 'admin';
        user.password = user.generateHash('123123');
        user.admin = true;
        user.mod = true;
        user.gender = 'Nam';
        user.fullname='Admin';
        user.birthDay="1997-1-1";
        user.createDate = date;
        user.email = "admin@eshop.com";
        // save the sample user
        user.save(function (err) {
            if (err) throw err;
            console.log('User saved successfully');
        });
    });*/

};
