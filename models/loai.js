var mongoose= require('mongoose');
var schemaLoai = new mongoose.Schema(
    {
        ten:{type:String,required:true, trim:true}
    }
);

var loaimodel = mongoose.model('loai_col',schemaLoai);
module.exports = loaimodel;