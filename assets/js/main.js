$(document).ready(() => {

    // Load Templates

    $.get("./footer.html", function (data) {
        $("#footer").html(data)
    });


    //  Animations



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

    updateCartCounter();
});

// Update Cart Counter

const updateCartCounter = () => {

    let cartCount = 0;
    if (localStorage.getItem("cart") != null) {
        // Get Cart Count
        cartCount = JSON.parse(localStorage.getItem("cart")).length;
    }

    if (cartCount > 0) {
        $(".nav-cart-count").show();
        $(".nav-cart-count").html(cartCount);
    } else {
        $(".nav-cart-count").hide();
    }

}
// Nav Search


const navSearch = () => {
    const searchTerm = $(".search-bar input").val();
    console.log("search :" + searchTerm)
    location.replace(`./winkel.html?${searchTerm}`);
}

// const mobileSearch = () => {
//     const searchTerm = $(".mobile-nav .search-bar input").val();
//     console.log("search :" + searchTerm)
//     location.replace(`./winkel.html?${searchTerm}`);
// }

$(".search-bar").on("submit", function (event) {
    event.preventDefault();
    navSearch();
});



// Mobile Nav {
$(".navbar-toggler, .mobile-nav-close").click(function () {
    $(".mobile-nav").toggleClass("mobile-nav-open");
    $("body, html").toggleClass("nav-no-scroll");
})