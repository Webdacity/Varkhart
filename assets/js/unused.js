// Shop Page Search, Sort & Filter

// SEARCH

// Search in current results for string included in product name
// const instantSearch = (term) => {

//     if (term == "") {
//         $(`.shop-product-grid a`).removeClass("product-hide");
//     } else {
//         // Get shop length 
//         const shopLength = $(".shop-product-grid").children().length;

//         for (i = 1; i <= shopLength; i++) {
//             const productName = $(`.shop-product-grid a:nth-child(${i}) .product-name`).html().toLowerCase();
//             // $(`.shop-product-grid a:nth-child(${i})`).hide()
//             if (!productName.includes(term.toLowerCase())) {
//                 $(`.shop-product-grid a:nth-child(${i})`).addClass("product-hide");
//             }
//         }
//     }
// }

// // (fire instant search on every keystroke)
// $("#instant-search").on("input", function () {
//     instantSearch($(this).val());
// });



// -----------------------------


// Filter Sizes

// const adjustFilterSizes = () => {
//     const shopLength = $(".shop-product-grid").children().length;
//     activeSizeOptions = [];

//     // Get Current Active Sizes Filter
//     for (i = 1; i <= $(".size-boxes").children().length; i++) {
//         if ($(`.size-boxes span:nth-child(${i})`).hasClass("active-size-filter")) {
//             activeSizeOptions.push($(`.size-boxes span:nth-child(${i})`).html());
//         }
//     }

//     // Match Above against prooduct sizes
//     for (i = 1; i <= shopLength; i++) {
//         currentProduct = $(`.shop-product-grid a:nth-child(${i}) template`);
//         currentSizes = currentProduct.attr("data-product-sizes");

//     }
// }

// $(".card-sizes .size-boxes>span").click(function () {
//     $(this).toggleClass("active-size-filter");
//     adjustFilterSizes();
// });


// ---------------------------------