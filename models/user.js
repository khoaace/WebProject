var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt =  require('bcrypt-nodejs');

var userSchema = new Schema({
        username: {type: String, require: true},
        password: {type: String, require: true},
        admin: {type: Boolean, require: true},
        mod: {type: Boolean, require: true},
        email: {type: String,require :true},
        fullname: {type: String,require :true},
        gender: {type: String, enum: ['Nam', 'Nữ'],require :true},
        birthDay: {type: String,require :true},
        createDate: {type: String,require :true},
        active:{type: Boolean},
        token:{type:String}
});
// Tạo mã hóa mật khẩu
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// kiểm tra mật khẩu có trùng khớp
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
var usermodel=mongoose.model('user_col',userSchema);
module.exports =usermodel;



