var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaBinhLuan = new Schema({
    nguoibinhluan: {type:String, require:true, trim: true},
    sanpham: {type: String,require :true, trim:true},
    thoigian: {type:Date, require:true},
    noidung:{ type:String, require:true}
});

var binhluanmodel = mongoose.model('binhluan_cols',schemaBinhLuan);
module.exports = binhluanmodel;