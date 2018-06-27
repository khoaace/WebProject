var mongoose= require('mongoose');
var random = require('mongoose-simple-random');
var Schema  = mongoose.Schema;

var schemaBrand = new Schema(
    {
        ten:{type:String,required:true, trim:true}
    }
);


var brandmodel = mongoose.model('brand_col',schemaBrand);
module.exports = brandmodel;