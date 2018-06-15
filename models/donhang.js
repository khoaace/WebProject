var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaDonHang = new Schema({
    tenkhachhang: {type:String, require:true, trim: true},
    sodienthoai: {type:String, require:true},
    diachinhanhang:{ type:String, require:true, trim:true},
    thanhtoan: {type: String, enum: ['COD', 'BANK'],require :true},
    trangthai: {type: String, enum: ['Chưa Xử Lý','Đang Giao','Thành Công','Hủy']},
    sanpham: [{type: Schema.ObjectId, ref: 'product'}],
    soluong: [{type: Number}],
    gia: [{type: Number}],
    ngaygio: {type:Date},
    ghichu: {type:String}
});

var donhangmodel = mongoose.model('donhang_cols',schemaDonHang);
module.exports = donhangmodel;