$(document).ready(() => {

    // Load Templates

    $.get("./footer.html", function (data) {
        $("#footer").html(data)
    });

    // Initiate Tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    //  Animations

    $(".cart-content-item-delete i").hover(
        function () {
            $(this).toggleClass("fal");
            $(this).toggleClass("fas");
        },
        function () {
            $(this).toggleClass("fas");
            $(this).toggleClass("fal");
        }
    );

    $(".search-button").hover(
        function () {
            $(this).children().toggleClass("far");
            $(this).children().toggleClass("fas");
        },
        function () {
            $(this).children().toggleClass("fas");
            $(this).children().toggleClass("far");
        }
    );

    $(".product-page-sizes button").click(
        function () {
            $(".active-size").toggleClass("active-size");
            $(this).toggleClass("active-size");
        }
    );

});