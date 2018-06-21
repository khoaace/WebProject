module.exports = function (app, passport) {
    var Product =  require('../models/product');
    var Loai = require('../models/loai');
    var User  =require('../models/user');
    var bodyParser = require('body-parser');
    var jwt = require('jsonwebtoken');
    var email = require('mailer');
    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    var nodemailer = require('nodemailer');
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
        Loai.find(function (err,result) {
            res.render('user/profile', {title: 'eShop - Profile', loai:result,user: req.user, message: req.flash('info')});
        });
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
        var gender;
       if(req.body.gender == 'None')
           gender = req.body.genderbackup;
       else
           gender = req.body.gender;
            User.where({username: req.user.username}).update({
                fullname: req.body.fullname,
                gender: gender,
                birthDay: req.body.birthday
            }).exec(function (err, doc) {
            });
            req.flash('info', ['alert-success', 'Cập nhật thông tin thành công.']);
            res.redirect('/profile');
    });


   /* Kích hoạt tài khoản và gmail*/
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'panda.a7c21@gmail.com',
            pass: 'Bestteamever'
        }
    });

    var mailOptions = {
        from: 'eShop - Kích hoạt tài khoản',
        to: 'someone@gmail.com',
        subject: 'Sending Email from Eshop',
        html: 'Content'
    };

    app.get('/active/:id',function (req,res) {
        var id = req.params.id;
       User.findOne({_id:id},function (err,myuser) {
          if(myuser.active)
          {
              req.flash('info','Tài khoản đã được kích hoạt.');
              res.redirect('/error');
          }
          else
          {
              const payloadActive =  {
                  resetPassword:false
              };
              var activeToken = jwt.sign(payloadActive,'active', {
                  expiresIn: 900 // token tồn tại trong 15 phút
              });
             /* Gửi mail*/
             mailOptions.to = myuser.email;
             mailOptions.html='Để kích hoạt tài khoản .Vui lòng nhấn vào <h1><a href="shop-pandateam.herokuapp.com/user/'+myuser.id+'/active/'+activeToken+'">đây</a></h1>. Lưu ý Link kích hoạt chỉ tồn tại trong 15 phút.';
              transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                      req.flash('info','Đã có lỗi xảy ra.');
                      res.redirect('/error');
                      console.log(error);
                  } else {
                      console.log('Email sent: ' + info.response);
                      req.flash('info','Thư kích hoạt đã được gửi.Vui lòng kiểm tra hòm thư.');
                      res.redirect('/error');
                  }
              });
          }
        });
    });
    app.get('/user/:id/active/:token',function (req,res) {
        var id = req.params.id;
        var token = req.params.token;
            // verifies secret and checks exp
            jwt.verify(token, 'active', function(err, decoded) {
                if (err) {
                    req.flash('info','Hết hiệu lực vui lòng thử lại.');
                    res.redirect('/error');
                } else {
                    req.decoded = decoded;
                        User.where({_id: id}).update({
                            active:true
                        }).exec(function (err, doc) {
                        });
                        req.flash('info', 'Kích hoạt tài khoản thành công.');
                        res.redirect('/error');
                }
            });

    });

    app.get('/forgotpassword',isUnLoggedIn,function (req,res) {
        Loai.find(function (err,result) {
            res.render('user/forgotPassword',{title:'eShop - Quên mật khẩu',Loai:result,message: req.flash('info')});
        });
    });

    app.post('/forgotpassword',urlencodedParser,isUnLoggedIn,function (req,res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        User.findOne({username:username},function (err,result) {
           if(result == null)
           {
               req.flash('info', 'Không tìm thấy tên đăng nhập này.');
               res.redirect('/forgotpassword');
           }
           else
           {
               if(result.email != email)
               {
                   req.flash('info', 'Email bạn nhập không trùng khớp.');
                   res.redirect('/forgotpassword');
               }
               if(!result.active)
               {
                   req.flash('info', 'Tài khoản hiện chưa được kích hoạt Không thể sử dụng tính năng này.');
                   res.redirect('/forgotpassword');
               }
               else
               {
                   const payloadActive =  {
                       id:result._id,
                       password:password
                   };
                   var activeToken = jwt.sign(payloadActive,'active', {
                       expiresIn: 900 // token tồn tại trong 15 phút
                   });
                   /* Gửi mail*/
                   mailOptions.from="eShop - Lấy lại mật khẩu";
                   mailOptions.to = result.email;
                   mailOptions.html='Để lấy lại mật khẩu. Vui lòng nhấn vào <h1><a href="shop-pandateam.herokuapp.com/user/'+result.id+'/reset/'+activeToken+'">đây</a></h1>. Lưu ý Link kích hoạt chỉ tồn tại trong 15 phút.';
                   transporter.sendMail(mailOptions, function(error, info){
                       if (error) {
                           req.flash('info','Đã có lỗi xảy ra.');
                           res.redirect('/error');
                           console.log(error);
                       } else {
                           console.log('Email sent: ' + info.response);
                           req.flash('info','Vui lòng kiểm tra hòm thư để lấy lại mật khẩu.');
                           res.redirect('/error');
                       }
                   });
               }
           }
        });
    });

    app.get('/user/:id/reset/:token',isUnLoggedIn,function (req,res) {
        var id = req.params.id;
        var token = req.params.token;
        // verifies secret and checks exp
        jwt.verify(token, 'active', function(err, decoded) {
            if (err) {
                req.flash('info','Hết hiệu lực vui lòng thử lại.');
                res.redirect('/error');
            } else {
                req.decoded = decoded;
                var tempUser = new User();
                var password =tempUser.generateHash(decoded.password);
                User.where({_id: decoded.id}).update({
                    password:password
                }).exec(function (err, doc) {
                });
                    req.flash('info', 'Đổi mật khẩu thành công.');
                    res.redirect('/error');
            }
        });
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




/*
// Tạo tài khoản Admin
    app.get('/setup', function (req, res) {
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
        user.email = "khoaace@gmail.com";
        user.active = true;
        // save the sample user
        user.save(function (err) {
            if (err) throw err;
            console.log('User saved successfully');
        });
    });
*/

};
