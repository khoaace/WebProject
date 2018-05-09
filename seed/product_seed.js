var Product =  require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eshopping');

var products = [
    new Product({
        ma: "04",
        ten: "Ghế dựa",
        gia: 500000,
        loai: "Ghế dựa",
        nhanhieu: "Ghế hòa phát",
        xuatxu:"Việt Nam",
        hinhanh:"images/gheXoay.PNG"
     }),
 new Product({
     ma: "02",
   ten: "Ghế văn phòng",
    gia: 3000000,
    loai: "Ghế xoay",
    nhanhieu: "Ghế hòa phát",
    xuatxu:"Việt Nam",
    hinhanh:"images/gheXoay.PNG"
 }),
 new Product({
    ma: "03",
    ten: "Ghế giám đốc",
    gia: 5000000,
    loai: "Ghế xoay",
    nhanhieu: "Ghế hòa phát",
    xuatxu:"Việt Nam",
   hinhanh:"images/gheXoay.PNG"
})
];

var done =0;
for(var i=0;i<products.length;i++)
{
    products[i].save(function (err,result) {
        done++;
        if(done === products.length)
        {
            exit();
        }
    });

}
function exit() {
    mongoose.disconnect();
}
