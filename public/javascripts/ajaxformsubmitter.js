/* product-add.hbs */
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
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'ten'              : $("#name_textinput").val(),
            'loai'             : $("#selectbasic").val(),
            'nhanhieu'         : $("#brand_textinput").val(),
            'xuatxu'           : $("#made_textinput").val(),
            'gia'              : $("#price_textinput").val(),
            'mota'             : $("#desc_textarea").val(),
            'hinhanh'          : [
                                    $("#link1_textinput").val(),
                                    $("#link2_textinput").val(),
                                    $("#link3_textinput").val()
                                ]
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
            $("#main_modal_body_alert").html('Sản Phẩm Đã Được Thêm Mới');
            $("#modalbox").modal('show');

            $("#name_textinput").val('');
            $("#link1_textinput").val('');
            $("#link2_textinput").val('');
            $("#link3_textinput").val('');

            $("#name_textinput").focus();
        })
        .fail(function(data){
            var nulllist = data.responseJSON;
            $("#main_modal_body_alert").html('Vui lòng điền đủ các thông tin');
            $(".modal-footer").html('<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
        });

        $("#loadingimg").slideUp();
    });
});



/* category-list.hbs*/
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
            $("#main_modal_body_alert").html('Thêm mới thành công')
            $("#main_modal_footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
        })
        .fail(function(data){
            $("#main_modal_body_alert").html('Thêm mới Thất Bại')
            $("#main_modal_footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
            $("#modalbox").modal('show');
        });
    });

    var formData;

    $(".smbutton_editcategory").on('click', function(event){
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
            console.log(data);
            var iddanhmuc = "#" + formData.id + "_id";
            console.log(data);
            $("#dialog_edit").modal('hide');
            $(iddanhmuc).html(data.ten);

            $(".modal-body").html('<p id="modalalert">Cập Nhật Thành Công</p>')
            $(".modal-footer").html('<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>');
            $("#modalbox").modal('show');
        }).fail(function(data){
            $("#modalbox").modal('hide');
            $(".modal-body").html('<p id="modalalert">Cập Nhật Không Thành Công</p>')
            $(".modal-footer").html('<button type="button" class="btn btn-danger" data-dismiss="modal">Hủy</button>');
            $("#modalbox").modal('show');
        });
    });

});