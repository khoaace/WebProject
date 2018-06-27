var mongoose= require('mongoose');
var random = require('mongoose-simple-random');
var Schema  = mongoose.Schema;

var schemaProduct = new Schema(
    {
        ten:{type:String,required:true, trim:true},
        gia:{type:Number, min:0,required:true},
        tenTimKiem:{type:String,required:true, trim:true},
        loai:{type: Schema.ObjectId, ref: 'loai'},
        nhanhieu:{type:Schema.ObjectId, ref: 'brand'},
        hinhanh:[{type:String}],
        xuatxu:{type:String, default:'Không rõ', trim:true},
        mota:{type:String, default:'Không có mô tả'}
    }
);

//Thêm các hàm random cho schema
schemaProduct.plugin(random);

var productmodel = mongoose.model('product_col',schemaProduct);
module.exports = productmodel;