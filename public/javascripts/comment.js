$(document).ready(function () {
    $('a.someclass').click(function(e)
    {
        e.preventDefault();
    });
    $('#updateCmt').click(function(e)
    {
        if($("#contentCmt").val().trim()=="")
        {
            $("#snackbar").html('Chưa nhập nội dung');
            var x = document.getElementById("snackbar");
            // Add the "show" class to DIV
            x.className = "show";
            // After 3 seconds, remove the show class from DIV
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
        else {
            var dataComment = {
                'nguoibinhluan': $("#userCmt").val(),
                'idCmt': $("#idCmt").val(),
                'noidung': $("#contentCmt").val(),
                'curpage': $("#curPage").val()
            };
            $.ajax({
                type: 'POST',
                url: '/product/detail/comment/update',
                data: dataComment
            }).done(function (data) {
                if (data == "thanhcong") {
                    $("#snackbar").html('Chỉnh sửa thành công');
                    var x = document.getElementById("snackbar");
                    // Add the "show" class to DIV
                    x.className = "show";
                    // After 3 seconds, remove the show class from DIV
                    setTimeout(function () {
                        x.className = x.className.replace("show", "");
                    }, 3000);
                    $("#productComment").load(window.location.pathname + ' #productComment');
                    $("#listPage").load(window.location.pathname + ' #listPage');
                    $("#comment").val('');
                    $('#commentModal').modal('hide');
                }
                else {
                    $("#snackbar").html('Bạn không có quyền');
                    var x = document.getElementById("snackbar");
                    // Add the "show" class to DIV
                    x.className = "show";
                    // After 3 seconds, remove the show class from DIV
                    setTimeout(function () {
                        x.className = x.className.replace("show", "");
                    }, 3000);
                }
            }).fail(function (data) {
                $("#snackbar").html('Thất bại');
                var x = document.getElementById("snackbar");
                // Add the "show" class to DIV
                x.className = "show";
                // After 3 seconds, remove the show class from DIV
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
            });
        }
    });


    $('#deleteCmt').click(function(e)
    {
        var dataComment = {'nguoibinhluan': $("#userCmt").val(),
            'idCmt':$("#idCmt").val(),
            'noidung':$("#contentCmt").val()
        };
        $.ajax({
            type:'POST',
            url:'/product/detail/comment/delete',
            data:dataComment
        }).done(function (data) {
            if (data == "thanhcong") {
                $("#snackbar").html('Đã xoá bình luận');
                var x = document.getElementById("snackbar");
                // Add the "show" class to DIV
                x.className = "show";
                // After 3 seconds, remove the show class from DIV
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                $("#productComment").load(window.location.pathname + ' #productComment');
                $("#listPage").load(window.location.pathname + ' #listPage');
                $("#comment").val('');
                $('#commentModal').modal('hide');
            }
            else {
                $("#snackbar").html('Bạn không có quyền');
                var x = document.getElementById("snackbar");
                // Add the "show" class to DIV
                x.className = "show";
                // After 3 seconds, remove the show class from DIV
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
            }
        }).fail(function (data) {
            $("#snackbar").html('Thất bại');
            var x = document.getElementById("snackbar");
            // Add the "show" class to DIV
            x.className = "show";
            // After 3 seconds, remove the show class from DIV
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        });
    });

    var cmt =  document.getElementById("productComment");
    if(!$("div").hasClass("panel-default"))
    {
        $("#listPage").empty();
    }
    $("#sendComment").click(function (event) {
       event.preventDefault();
       if($("#userCurCmt").val().trim() =="")
       {
           $("#snackbar").html('Chưa nhập tên');
           var x = document.getElementById("snackbar");
           // Add the "show" class to DIV
           x.className = "show";
           // After 3 seconds, remove the show class from DIV
           setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
       }
       if($("#comment").val().trim() == "")
       {
           $("#snackbar").html('Chưa nhập nội dung');
           var x = document.getElementById("snackbar");
           // Add the "show" class to DIV
           x.className = "show";
           // After 3 seconds, remove the show class from DIV
           setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
       }
       else {
           var dataComment = {
               'nguoibinhluan': $("#userCurCmt").val(),
               'sanpham': $("#idProduct").val(),
               'noidung': $("#comment").val()
           };
           $.ajax({
               type: 'POST',
               url: '/product/detail/comment',
               data: dataComment
           }).done(function (data) {
               $("#snackbar").html('Bình luận thành công');
               var x = document.getElementById("snackbar");
               // Add the "show" class to DIV
               x.className = "show";
               // After 3 seconds, remove the show class from DIV
               setTimeout(function () {
                   x.className = x.className.replace("show", "");
               }, 3000);
               $("#productComment").load(window.location.pathname + ' #productComment');
               $("#listPage").load(window.location.pathname + ' #listPage');
               $("#comment").val('');
           }).fail(function (data) {
           });
       }
    });

});


function editComment(id,username,noidung) {


        var dataComment = {
            'nguoibinhluan': username,
            'idCmt': $("#idCmt").val(),
            'noidung': $("#contentCmt").val(),
            'curpage': $("#curPage").val()
        };
        $.ajax({
            type: 'POST',
            url: '/product/detail/comment/check',
            data: dataComment
        }).done(function (data) {
            if (data.localeCompare("thanhcong") == 0) {
                $("#contentCmt").val(noidung);
                $("#userCmt").val(username);
                $("#idCmt").val(id);
                $("#commentModal").modal();
            }
            else {
                $("#snackbar").html('Bạn không có quyền thực hiện chức năng này');
                var x = document.getElementById("snackbar");
                // Add the "show" class to DIV
                x.className = "show";
                // After 3 seconds, remove the show class from DIV
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
            }
        }).fail(function (data) {
            $("#snackbar").html('Bạn không có quyền thực hiện chức năng này');
            var x = document.getElementById("snackbar");
            // Add the "show" class to DIV
            x.className = "show";
            // After 3 seconds, remove the show class from DIV
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        });
}

function getPaging(page) {
    $("#snackbar").html('Đang chuyển trang');
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    var dataComment = {'page':page
    };
    $.ajax({
        type:'POST',
        url:'/product/detail/comment/page',
        data:dataComment
    }).done(function (data) {
        $("#productComment").load(window.location.pathname +  ' #productComment');
        $("#listPage").load(window.location.pathname +  ' #listPage');
    }).fail(function (data) {
    });
}

