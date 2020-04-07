// Nav Search Bar
const loadNavSearch = () => {
    // Get Search Term
    let searchTerm = window.location.href;
    if (searchTerm.includes("?") > 0) {
        searchTerm = searchTerm.slice(searchTerm.indexOf("?") + 1).toLocaleLowerCase();
    } else {
        searchTerm = null;
    }

    // {Find products who's product tags match ~ searchterm}
    if (searchTerm !== null) {
        const shopLength = $(".shop-product-grid").children().length;
        let resultsCount = 0;
        // Loop through every product to & hide non-results
        for (i = 1; i <= shopLength; i++) {

            const productTags = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-tags").toLowerCase();
            // Load Results
            if (!productTags.includes(searchTerm)) {
                $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-search")
            } else {
                resultsCount++
            }
        }
        // Check for no results
        if (resultsCount == 0) {
            $(`.shop-product-grid`).hide()
            $(`.shop-products-noresults`).fadeIn()
        }
    }


    // (Insert searchterm in filters)
    if (searchTerm != null) {
        $(".card-search").css("display", "flex");
        $(".card-search input").val(`-  "${searchTerm}"`);
    } else {
        $(".card-search").hide();
    }
}



// CLear Nav Search
$(".card-search .card-body i").click(() => {
    location.replace("./winkel.html")
})

// FILTER

// CLear Filter
$(".filter-heading i").click(() => {
    location.replace("./winkel.html")
})

// Filter Price

const loadFilterPrice = () => {
    // Get min max
    const shopLength = $(".shop-product-grid").children().length;
    let minPrice = 0;
    let maxPrice = 0;
    let currentPrice = 0;
    let priceRange = [];

    for (i = 1; i <= shopLength; i++) {
        currentPrice = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
        priceRange.push(currentPrice);
        priceRange.sort(function (a, b) {
            return a - b
        });
    }

    minPrice = priceRange[0];
    maxPrice = priceRange[priceRange.length - 1];
    $("#price-filter-min").val(minPrice);
    $("#price-filter-max").val(maxPrice);

    $(".price-filter-body input").change(function () {
        for (i = 1; i <= shopLength; i++) {
            currentPriceToFilter = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
            if (currentPriceToFilter > maxPrice || currentPriceToFilter < minPrice) {
                $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-price")
            } else {
                $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-price")
            }
        }
    });



    // $("#slider-range").slider({
    //     range: true,
    //     min: minPrice,
    //     max: maxPrice,
    //     values: [minPrice, maxPrice],
    //     slide: function (event, ui) {
    //         $("#amount").val("R " + ui.values[0] + " - R " + ui.values[1]);

    //         // Change products on slide
    //         for (i = 1; i <= shopLength; i++) {
    //             currentPrice = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
    //             // Min Price
    //             if (currentPrice < ui.values[0]) {
    //                 $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-price")
    //             } // Max Price
    //             else if (currentPrice > ui.values[1]) {
    //                 $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-price")
    //             } else {
    //                 $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-price")
    //             }
    //         }
    //     }
    // });
    // $("#amount").val("R " + $("#slider-range").slider("values", 0) +
    //     " - R " + $("#slider-range").slider("values", 1));

}






// Filter Colors
const loadFilterColors = () => {
    // Get shop length 
    const shopLength = $(".shop-product-grid").children().length;
    const productColors = [];
    let currentProduct;
    let currentColor;

    // Insert Color Filter Options
    for (i = 1; i <= shopLength; i++) {
        currentProduct = $(`.shop-product-grid a:nth-child(${i}) template`);
        // Color
        currentColor = currentProduct.attr("data-product-color").toLowerCase();
        productColors.push(currentColor);
        $(".card-color .color-boxes").append(
            `<span style="background-color:${currentColor}" data-toggle="tooltip" data-placement="top" title="${currentColor}"></span>`
        );
    }
}

const adjustFilterColors = () => {
    const shopLength = $(".shop-product-grid").children().length;
    activeColorOptions = [];
    let activeColor = "";
    let productColor = "";

    // Get Current Active Color Filter
    for (i = 1; i <= $(".color-boxes").children().length; i++) {
        if ($(`.color-boxes span:nth-child(${i})`).hasClass("active-color-filter")) {
            activeColor = $(`.color-boxes span:nth-child(${i})`).attr("style");
            activeColor = activeColor.slice(activeColor.indexOf(":") + 1);
            activeColorOptions.push(activeColor);
        }
    }

    // Match Above against product colors
    for (i = 1; i <= shopLength; i++) {
        productColor = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-color");
        if (activeColorOptions.length > 0 && activeColorOptions.indexOf(productColor) < 0) {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-color")
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-color")
        }
    }

}

$(document).on("click", ".card-color .color-boxes span", function () {
    $(this).toggleClass("active-color-filter");
    $(`.color-boxes span`).not("active-color-filter").addClass("active-color-filter-not");
    adjustFilterColors();
});

// Filter Category
// $(".categoryGender").click(function () {
//     $(".categoryGender").removeClass("active-category-gender")
//     $(this).addClass("active-category-gender");
// })



$(".card-category p").click(function () {
    if ($(this).hasClass("active-category-filter")) {
        $(".shop-product-grid a").removeClass("filter-hide-category");
    } else {
        $(".categoryGender").removeClass("active-category-gender");
        $(this).closest(".collapse ").prev().first().addClass("active-category-gender");

        let activecategoryOption = $(this).find("span").html();
        let activeCategoryGender = $(".active-category-gender span").html();
        console.log(activeCategoryGender, activecategoryOption)


        filterCategories(activecategoryOption, activeCategoryGender);
    }

    if ($(this).hasClass("active-category-filter")) {
        $(".card-category p").removeClass("active-category-filter");
        $(this).children().first().addClass("fal fa-square");
        $(this).children().first().removeClass("fas fa-check-square");
    } else {
        $(".card-category p").removeClass("active-category-filter");
        $(this).addClass("active-category-filter");
        $(".card-category p i").removeClass("fas fa-check-square");
        $(".card-category p i").addClass("fal fa-square");
        $(this).children().first().removeClass("fal fa-square");
        $(this).children().first().addClass("fas fa-check-square");
    }
});

$("#categoryBybehore").click(function () {
    const shopLength = $(".shop-product-grid").children().length;
    console.log("bybehore")
    for (i = 1; i <= shopLength; i++) {
        productGender = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-gender");
        productCategory = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-category");
        if (productCategory == "Bybehore") {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-category");
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-category");
        }
    }
})

const filterCategories = (activecategoryOption, activeCategoryGender) => {
    const shopLength = $(".shop-product-grid").children().length;
    let activeCategory = "";
    let productCategory = "";
    let productGender = "";


    // Match Above against product catgories
    for (i = 1; i <= shopLength; i++) {
        productGender = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-gender");
        productCategory = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-category");


        if (productCategory == activecategoryOption && productGender == activeCategoryGender) {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-category");
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-category");
        }
    }
}








// SORT 

// {sort products according to select options}
const shopSort = (option) => {
    switch (option) {
        case "":
            location.reload()
            break;
        case "Nuut":
            const products = $(".product > span").attr("data-product-promo", "Nuut").parent()
            $(products).detach();
            $(products).prependTo(".shop-product-grid");
            break;
        case "Price-LH":

            break;
        case "Price-HL":

            break;
        default:
            break;
    }
    // if (option == "Nuut") {

    // }
}

//  (Run sorting on select change)
$(".shop-display-sort select").change(function () {
    shopSort($(this).val());
});


// ------------------

// INSERT PRODUCTS 

// Insert Products in Store:
const loadShopProducts = () => {
    let shopLength = 0;
    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);

            // Get Object Keys
            const productKeys = Object.keys(response);

            // Insert HTML
            for (i = 0; i < productKeys.length; i++) {
                shopLength++;
                // Get product details
                const productID = productKeys[i];
                const product = response[productID];

                // Insert HTML
                $(".shop-product-grid").append(
                    `<a class="col-10 offset-1 offset-sm-0 col-sm-6 col-md-6 col-lg-4 col-xl-3 product" href="./produk.html#${productID}" id="${productID}" >
                    <template data-product-tags="${product.name},${product.category},${product.subcategory},${product.color},${product.gender},${product.colorGroup},${product.material}"
                    data-product-color="${product.colorGroup}"
                    data-product-sizes="${product.sizes}"
                    data-product-price="${product.price}"
                    data-product-gender="${product.gender}"
                    data-product-category="${product.category}"
                    ></template>
                    <div class="product-image-container">
                    <img src="./assets/images/products/${productID}/1-thumb.png" alt="Varhart Product ${productID} - ${product.name}">
                    </div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">R ${product.price}</p>
                </a>`
                );

                // Insert Product Tag
                if (product.promo !== "") {
                    $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${productID}`)
                }

            }

        }
    };
    xhttp.open("GET", "./assets/js/products.json", false);
    xhttp.send();
    loadNavSearch();
    loadFilterColors();
    loadFilterPrice();
}

// Insert Products in Product Page:
const loadProductPage = () => {

    // Get Product ID:
    let productID = window.location.hash; //Get Recipe ID
    productID = productID.substr(1); //Remove #

    // Return to home page if no hash
    if (productID == "") {
        window.location.pathname = "/winkel.html"
    }

    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            const product = response[productID]

            // Insert HTML
            document.title = product.name;
            $(".product-page-name").html(product.name);
            $(".product-page-price").html(`R ${product.price}`);
            $(".product-page-description").html(product.description);
            $(".product-page-gender p").html(product.gender);
            $(".product-page-color p").html(product.color);

            // Info
            const info = product.info;
            if (info.length !== 0) {
                for (i = 0; i < info.length; i++) {
                    if (i == 0) {
                        $(`<span>${info[i]}</span>`).appendTo(".product-page-info p:first-child()")

                    } else {
                        $(`<span> | ${info[i]}</span>`).appendTo(".product-page-info p:first-child()")
                    }
                }
            }

            // Material
            const material = product.material;
            if (material.length !== 0) {
                $(".product-page-info").append(
                    `<p>${product.material}</p>`
                )
            }

            // Sizes
            const sizes = product.sizes;
            if (sizes.length == 0) {
                $(".product-page-sizes-buttons").append(
                    // `<p> Een Groote </p>`
                    `<button class="active-size">Een Grootte</button>`
                )
            } else {
                for (i = 0; i < sizes.length; i++) {
                    $(".product-page-sizes-buttons").append(
                        `<span>${sizes[i]}</span>`
                    )
                }
            }


            // Images 
            for (i = 0; i < product.images; i++) {
                $(".product-slick").append(
                    `
                    <div class="product-slick-image-container">
                    <img src="./assets/images/products/${productID}/${i+1}.png" alt="Varkhart Product Slide - ${productID}"/>
                    </div>
                    `
                )
            }

            $('.product-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
            })

            // Hide arrows if 1 image
            if ($(".slick-track").children().length <= 1) {
                $(".slick-arrow").hide();
            }

        }
    };
    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}


// Insert Products in Home:
const loadHomeProducts = () => {

    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            // Get Object Keys
            const productKeys = Object.keys(response);

            // Insert HTML
            for (i = 0; i < productKeys.length; i++) {
                // Get product details
                let productID = productKeys[i];
                let product = response[productID];

                if (product.home == true) {
                    // Insert HTML
                    $(".product-range").append(
                        `
                        <a class="col-10 offset-1 offset-sm-0 col-sm-6 col-md-3 product" href="./produk.html#${productID}" id="${productID}">
                            <div class="product-image-container">
                                <img class="img-fluid" src="./assets/images/products/${productID}/1-thumb.png" alt="Varkhart Bestseller Product - ${productID}">
                            </div>
                            <p class="product-name">${product.name}</p>
                            <p class="product-price">R ${product.price}</p>
                            <div class="product-divider"></div>
                        </a>`
                    );


                    // // Insert Product Promo
                    // if (product.promo !== "") {
                    //     $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${productID}`)
                    // }
                }


            }

        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}

$(document).on("click", ".product-page-sizes-buttons >*", function () {
    $(".active-size").toggleClass("active-size");
    $(this).toggleClass("active-size");
});


// ------------
// LOADING

if (window.location.pathname == "/index.html" || window.location.pathname == "/") {
    loadHomeProducts();
}

if (window.location.pathname == "/produk.html") {
    loadProductPage();
}

if (window.location.pathname == "/winkel.html") {
    loadShopProducts();
}




// SLICK

// SLick Arrows
$("#slick-next").click(() => {
    $('.product-slick').slick("slickNext");
})
$("#slick-prev").click(() => {
    $('.product-slick').slick("slickPrev");
})