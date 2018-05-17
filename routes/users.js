var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.route('/login')
    .get(function (req, res) {
        res.render('user/signin', {
            'title': 'Log in'
        })
    })
    .post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect:'/login' }));*/

module.exports = router;
