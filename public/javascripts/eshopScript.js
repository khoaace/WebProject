$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('.text-muted').each(function(){
        var date = new Date($(this).html());
        $(this).html() = date.toLocaleString("en-US", {timeZone: 'Asia/Jakarta' });
    });
});

$(document).ready(function(){

    $(function(){

        $(document).on( 'scroll', function(){

            if ($(window).scrollTop() > 100) {
                $('.scroll-top-wrapper').addClass('show');
            } else {
                $('.scroll-top-wrapper').removeClass('show');
            }
        });

        $('.scroll-top-wrapper').on('click', scrollToTop);
    });

    function scrollToTop() {
        verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
        element = $('body');
        offset = element.offset();
        offsetTop = offset.top;
        $('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
    }

});


$(document).ready(function()
{
    var navItems = $('.admin-menu li > a');
    var navListItems = $('.admin-menu li');
    var allWells = $('.admin-content');
    var allWellsExceptFirst = $('.admin-content:not(:first)');
    allWellsExceptFirst.hide();
    navItems.click(function(e)
    {
        e.preventDefault();
        navListItems.removeClass('active');
        $(this).closest('li').addClass('active');
        allWells.hide();
        var target = $(this).attr('data-target-id');
        $('#' + target).show();
    });
});
/*Xử lý cho trang sản phẩm*/



function getPagingIndex(page) {
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
        url:'/index/page',
        data:dataComment
    }).done(function (data) {
        $("#indexProduct").load(window.location.href +  ' #indexProduct');
        $("#listPageIndex").load(window.location.href +  ' #listPageIndex');
    }).fail(function (data) {
        $("#indexProduct").load(window.location.href +  ' #indexProduct');
        $("#listPageIndex").load(window.location.href +  ' #listPageIndex');
    });
}

// Xử lý của trang dashboard user

