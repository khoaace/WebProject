//===================== product-add.hbs =======================
$(document).ready(function() {

    $("#loadingimg").hide();    

    $("form-horizontal").submit(function(event){
        event.preventDefault();
    });

    // process the form
    $("#smbutton").on('click',function(event) {
        
        $("#loadingimg").slideDown(); 

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();

        var imglist = [];
        if($("#link1_textinput").val() != '')
        {
            imglist.push($("#link1_textinput").val());
        }
        if($("#link2_textinput").val() != '')
        {
            imglist.push($("#link2_textinput").val());
        }
        if($("#link3_textinput").val() != '')
        {
            imglist.push($("#link3_textinput").val());
        }

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'ten'              : $("#name_textinput").val(),
            'loai'             : $("#selectbasic").val(),
            'nhanhieu'         : $("#brand_textinput").val(),
            'xuatxu'           : $("#made_textinput").val(),
            'gia'              : $("#price_textinput").val(),
            'mota'             : $("#desc_textarea").val(),
            'hinhanh'          : imglist
        };

        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/product/add', // the url where we want to POST
            data        : formData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            //encode      : true,

            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        })
        .done( function( data ) {
            // Handles successful responses only
            //$("#smbutton").html('saved');
            //$("#testbutton").click();
            $("#main_modal_header").attr("style","background-color: #00810b")
            $("#main_modal_body_alert").html('Sản Phẩm Đã Được Thêm Mới');
            $("#main_modal_footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');

            $("#name_textinput").val('');
            $("#link1_textinput").val('');
            $("#link2_textinput").val('');
            $("#link3_textinput").val('');

            $("#name_textinput").focus();
        })
        .fail(function(data){
            var nulllist = data.responseJSON;
            $("#main_modal_header").attr("style","background-color: red")
            $("#main_modal_body_alert").html('Vui lòng điền đủ các thông tin');
            $("#main_modal_footer").html('<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
        });

        $("#loadingimg").slideUp();
    });
});



//========================= category-list.hbs ==================
$(document).ready(function(){
    $("form").submit(function(event){
        event.preventDefault();
    });
    /* thêm danh mục mới */
    $("#smbutton_addcategory").on('click', function(event){
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/dashboard/category/add',
            data: {'ten': $("#newgenres_textinput").val()}
        })
        .done(function(data){
            $("#newgenres_textinput").val('');
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body_alert").html('Thêm mới thành công')
            $("#main_modal_footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
            //reload page content
            $(".category_table").load(window.location.pathname +  ' .category_table');
        })
        .fail(function(data){
            $("#main_modal_header").attr("style",'background-color: red');
            $("#main_modal_body_alert").html('Thêm mới Thất Bại')
            $("#main_modal_footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
            $("#modalbox").modal('show');
        });
    });

    var formData;

    /* chỉnh sửa */
    //nút sửa thông tin, mỗi row
        //những element mà có thể bị thay đổi sau, thì viết kiểu này mới chạy được ở lần sau.
    $(document).on('click', ".smbutton_editcategory", function(event){
        event.preventDefault();
        var genresid = $(this).attr('id');
        var genresname = $(this).attr('name');

        formData =  {
            'ten'              : genresname,
            'id'               : genresid
        };
        
        $("#dialog_edit_body_textinput").val(genresname);
        $("#dialog_edit_body_id").val(genresid);
        
        $("#dialog_edit").modal('show');
    });

    //nút [cập nhật] trên pop modal
    $("#smbutton_editcategory_modal").on('click', function(event){
        //event.preventDefault();
        // process the form
        formData.ten = $("#dialog_edit_body_textinput").val();

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/category/edit', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,
    
            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        }).done(function(data){
            
            var iddanhmuc = "#" + formData.id + "_id";
            $("#dialog_edit").modal('hide');
            $(iddanhmuc).html(data.ten);

            $(".smbutton_editcategory").attr("name", data.ten);
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body").html('<p id="modalalert">Cập Nhật Thành Công</p>')
            $("#main_modal_footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
        }).fail(function(data){
            $("#modalbox").modal('hide');
            $("#main_modal_header").attr("style","background-color: red")
            $("#main_modal_body").html('<p id="modalalert">Cập Nhật Không Thành Công</p>')
            $("#main_modal_footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
            $("#modalbox").modal('show');
        });
    });

    /*Xóa danh mục*/
    //nút xóa danh mục mỗi row
    $(document).on('click','.smbutton_deletecategory', function(event){
        event.preventDefault();
        var genresid = $(this).attr('id');
        var genresname = $(this).attr('name');

        formData =  {
            'id'               : genresid
        };

        $("#dialog_delete_body").html('<p>Bạn có chắc chắn xoá <h4>' + genresname + '</h4> Mọi sản phẩm thuộc loại này sẽ bị xoá.</p>');
        
        $("#dialog_delete").modal('show');
    });

    //nút [XÓA] trên pop modal
    $("#smbutton_deletecategory_modal").on('click', function(event){
        //event.preventDefault();
        // process the form
        $("#dialog_delete").modal('hide');
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/category/delete', // the url where we want to POST
            data        : formData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            //encode      : true,
    
            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        }).done(function(data){
            console.log(data);
            $("#dialog_delete").modal('hide');
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body").html('<p id="modalalert">Xóa Thành Công</p>');
            $("#main_modal_footer").html('<button class="btn btn-success" data-dismiss="modal">OK</button>');
            //reload page content
            $(".category_table").load(window.location.pathname +  ' .category_table');
            

        }).fail(function(data){
            $("#modalbox").modal('hide');
            $("#main_modal_header").attr("style","background-color: red");
            $("#main_modal_body").html('<p id="modalalert">Xóa Không Thành Công</p>');
            $("#main_modal_footer").html('<button role="button" class="btn btn-danger" data-dismiss="modal>Hủy</button>');

        });
        
        $("#modalbox").modal('show');
    });

    /*select and delete*/
    $(document).on('click','#sm_button_selectdel', function(event){
        event.preventDefault();
        
        var del_list = [];

        $('input[name="checkbox"]').each(function(){
            if($(this).is(':checked'))
            {
                del_list.push($(this).val());
            }
        });

        var delformData = {
            'checkbox'          : del_list
        }
        console.log(delformData);
        event.preventDefault();
        // process the form
        
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/category/select-delete', // the url where we want to POST
            data        : delformData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            //encode      : true,
    
            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        }).done(function(data){
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body").html('<p id="modalalert">' + data + '</p>');
            $("#main_modal_footer").html('<button class="btn btn-success" data-dismiss="modal">OK</button>');
            //reload page content
            $(".category_table").load(window.location.pathname +  ' .category_table');
            

        }).fail(function(data){
            $("#main_modal_header").attr("style","background-color: red");
            $("#main_modal_body").html('<p id="modalalert">Xóa Không Thành Công</p>');
            $("#main_modal_footer").html('<button type="button" class="btn btn-default" data-dismiss="modal">Huỷ</button>');

        });
        
        $("#modalbox").modal('show');
    });
});
//================= product-generate  ==================
$(document).ready(function(){
    $("#sm_product_gen").on("click", function(event){
        event.preventDefault();

        var formData = {
            'loai'             : $("#selectbasic").val(),
            'count'            : $("#numberforgen_textinput").val()
        };
        
        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/product/generate', // the url where we want to POST
            data        : formData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,

            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        })
        .done( function( data ) {
            $("#main_modal_header").attr("style","background-color: #00810b");
            $("#main_modal_body").html('<p id="modalalert">' + data +'</p>');
            $("#main_modal_footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
        })
        .fail(function(data){
            switch (data.status){
                case 400: {
                    $("#main_modal_body").html('<p id="modalalert">Sai số lượng phát sinh!</p>');
                    $("#main_modal_footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
                } break;
                case 404: {
                    $("#main_modal_body").html('<p id="modalalert">Không tìm thấy danh mục</p>');
                    $("#main_modal_footer").html('<a href="'+data.responseText+'" class="btn btn-warning" role="button">Về trang Danh Mục</a><button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
                } break;
                default:
                {
                    $("#main_modal_body").html('<p id="modalalert">Xảy ra lỗi, xin thử lại!</p>');
                    $("#main_modal_footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
                }
            }
            $("#main_modal_header").attr("style","background-color: red");
        });

        $("#modalbox").modal('show');
    });
});

//================ product list ====================
$(document).ready(function(){
    

    /*select and delete*/
    $(document).on('click','#sm_button_selectdel_product', function(event){
        event.preventDefault();
        
        var del_list = [];

        $('input[name="checkbox"]').each(function(){
            if($(this).is(':checked'))
            {
                del_list.push($(this).val());
            }
        });

        var delformData = {
            'checkbox'          : del_list
        }
        console.log(delformData);
        event.preventDefault();
        // process the form
        
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard/product/select-delete', // the url where we want to POST
            data        : delformData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            //encode      : true,
    
            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        }).done(function(data){
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body").html('<p id="modalalert">' + data + '</p>');
            $("#main_modal_footer").html('<button class="btn btn-success" data-dismiss="modal">OK</button>');
            //reload page content
            $(".product_table").load(window.location.pathname +  ' .product_table');
            

        }).fail(function(data){
            $("#main_modal_header").attr("style","background-color: red");
            $("#main_modal_body").html('<p id="modalalert">Xóa Không Thành Công</p>');
            $("#main_modal_footer").html('<button type="button" class="btn btn-default" data-dismiss="modal">Huỷ</button>');

        });
        
        $("#modalbox").modal('show');
    });

    /*Xóa danh mục*/
    //nút xóa danh mục mỗi row
    $(document).on('click','.smbutton_deleteproduct', function(event){
        event.preventDefault();
        var productid = $(this).attr('id');
        var productname = $(this).attr('name');

        formData =  {
            'id'               : productid
        };

        $("#dialog_delete_body").html('<p>Bạn có chắc chắn xoá sản phẩm: </p> <h4>' + productname + '</h4>');
        
        $("#dialog_delete").modal('show');
    });

    //nút [XÓA] trên pop modal
    $("#smbutton_deletecategory_modal").on('click', function(event){
        //event.preventDefault();
        // process the form
        $("#dialog_delete").modal('hide');
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/dashboard//product/delete', // the url where we want to POST
            data        : formData // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            //encode      : true,
    
            /*success : function( data, textStatus, jqXHR ) {
                // Handle data transformation or DOM manipulation in here.
            }*/
        }).done(function(data){
            console.log(data);
            $("#dialog_delete").modal('hide');
            $("#main_modal_header").attr("style",'background-color: #00810b');
            $("#main_modal_body").html('<p id="modalalert">Xóa Thành Công</p>');
            $("#main_modal_footer").html('<button class="btn btn-success" data-dismiss="modal">OK</button>');
            //reload page content
            $(".product_table").load(window.location.pathname +  ' .product_table');
            

        }).fail(function(data){
            $("#modalbox").modal('hide');
            $("#main_modal_header").attr("style","background-color: red");
            $("#main_modal_body").html('<p id="modalalert">Xóa Không Thành Công</p>');
            $("#main_modal_footer").html('<button role="button" class="btn btn-danger" data-dismiss="modal>Hủy</button>');

        });
        
        $("#modalbox").modal('show');
    });
});