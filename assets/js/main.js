$(document).ready(() => {

    // Load Templates

    $.get("./footer.html", function (data) {
        $("#footer").html(data)
    });


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
});



// Nav Search


const navSearch = (e) => {
    const searchTerm = $(".search-bar input").val();
    console.log("search :" + searchTerm)
    location.replace(`./winkel.html?${searchTerm}`);
}

$(".search-bar").on("submit", function (event) {
    event.preventDefault();
    navSearch();
});