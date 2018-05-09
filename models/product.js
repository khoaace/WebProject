var mongoose= require('mongoose');
var schemaProduct = new mongoose.Schema(
    {
        //mã
        ma:{type:String,required:true},
        ten:{type:String,required:true, trim:true},
        gia:{type:Number, min:0,required:true,},
        loai:{type:String,enum:['Ghế xoay','Ghế dựa', 'Ghế chân quỳ'],required:true},
        nhanhieu:{type:String,required:true},
        hinhanh:[{type:String}],
        xuatxu:{type:String, default:'Không rõ', trim:true},
        mota:{type:String, default:'Không có mô tả'}
    }
);

var productmodel = mongoose.model('product_col',schemaProduct);
module.exports = productmodel;