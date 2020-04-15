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
    $(".price-filter-min").attr("min", minPrice);
    $(".price-filter-min").attr("max", maxPrice);
    $(".price-filter-max").attr("min", minPrice);
    $(".price-filter-max").attr("max", maxPrice);
    $(".price-filter-min").val(minPrice);
    $(".price-filter-max").val(maxPrice);

    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);

    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);

}

$(".price-filter-min, .price-filter-max").change(function () {
    console.log($(this).val());
    minPrice = $(".price-filter-min").val();
    maxPrice = $(".price-filter-max").val();
    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);
    adjustFilterPrice(minPrice, maxPrice);
});

const adjustFilterPrice = (minPrice, maxPrice) => {
    const shopLength = $(".shop-product-grid").children().length;
    for (i = 1; i <= shopLength; i++) {
        currentPriceToFilter = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
        if (currentPriceToFilter > maxPrice || currentPriceToFilter < minPrice) {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-price")
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-price")
        }
    }
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
    console.log(activecategoryOption, activeCategoryGender);
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
        } else if (productCategory == activecategoryOption && productGender == "Unisex") {
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
    // Axios GET
    showLoader();
    axios.get(`https://varkhart-backend.herokuapp.com/products`)
        .then((response) => {
            hideLoader()
            const products = response.data;

            products.forEach(product => {
                // Insert HTML
                $(".shop-product-grid").append(
                    `<a class="col-10 offset-1 offset-sm-0 col-sm-6 col-md-6 col-lg-4 col-xl-3 product" href="./produk.html#${product.productCode}" id="${product.productCode}" >
                        <template data-product-tags="${product.name},${product.category},${product.color},${product.gender},${product.material}, ${product.tags}"
                        data-product-color="${product.colorGroup}"
                        data-product-sizes="${product.sizes}"
                        data-product-price="${product.price}"
                        data-product-gender="${product.gender}"
                        data-product-category="${product.category}"
                        ></template>
                        <div class="product-image-container">
                        <img src="${product.productThumbnailUrl}">
                        </div>
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">R ${product.price}</p>
                    </a>`
                );

                // Insert Product Tag
                if (product.promo !== "") {
                    $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${product.productCode}`)
                }
            })
            loadNavSearch();
            loadFilterColors();
            loadFilterPrice();
        })
        .catch(err => {
            console.log(err);
        });

}

// Insert Products in Product Page:
const loadProductPage = () => {
    showLoader();
    // Get Product ID:
    let productCode = window.location.hash; //Get Recipe ID
    productCode = productCode.substr(1); //Remove #

    // Return to home page if no hash
    if (productCode == "") {
        window.location.pathname = "/winkel.html"
    }

    // JSON
    axios.get(`https://varkhart-backend.herokuapp.com/products/productCode/${productCode}`)
        .then((response) => {
            hideLoader();
            const product = response.data;
            console.log(product);


            // Insert HTML
            document.title = "Varkhart | " + product.name;
            $(".product-page-name").html(product.name);
            if (product.discount !== null) {
                $(".product-page-price").html(`R ${product.price * (100 - product.discount)/100}`);
                $(".product-page-price-container p").html(`${product.discount}% Af`)

            } else {
                $(".product-page-price").html(`R ${product.price}`);
            }
            $(".product-page-description").html(product.description);
            $(".product-page-gender p").html(product.gender);
            $(".product-page-color p").html(product.color);
            $(`<span>${product.info}</span>`).appendTo(".product-page-info p:first-child()")
            $(".product-page-info").append(
                `<p>${product.material}</p>`
            )


            // Material

            // Sizes
            const sizes = product.sizes;
            if (sizes.length == 1) {
                $(".product-page-sizes-buttons").append(
                    // `<p> Een Groote </p>`
                    `<button class="active-size">${sizes[0]}</button>`
                )
            } else {
                product.sizes.forEach(size => {
                    $(".product-page-sizes-buttons").append(
                        `<span>${size}</span>`
                    )
                })
            }

            // Images 
            product.productImageUrls.forEach(image => {
                $(".product-slick").append(
                    `
                    <div class="product-slick-image-container">
                    <img src="${image}" alt="Varkhart Product Slide - ${productCode}"/>
                    </div>
                    `
                )
            })

            $('.product-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
            })

            // Hide arrows if 1 image
            if ($(".product-slick .slick-track").children().length <= 1) {
                $(".product-slick-container .slick-arrow").hide();
            }

        })
        .catch(err => {
            if (err.response.status = 404) {
                window.location = "/winkel.html"
            } else {
                console.log(err);
            }
        });
}




// Insert Products in Home:
const loadHomeProducts = () => {

    axios.get(`https://varkhart-backend.herokuapp.com/products`)
        .then((response) => {
            const products = response.data;

            products.forEach(product => {
                if (product.home === true) {
                    console.log(product);
                    // Check for Discount
                    let productPrice;
                    if (product.discount > 0 || product.discount !== "") {
                        productPrice = product.price * (100 - product.discount) / 100
                    } else {
                        productPrice = product.price
                    }


                    // Insert HTML
                    $(".home-slick").append(
                        `
                        <a class="col-10 offset-1 offset-sm-0 col-sm-6 col-md-3 product" href="./produk.html#${product.productCode}" id="${product.productCode}">
                            <div class="product-image-container">
                                <img src="${product.productThumbnailUrl}" alt="Varkhart Bestseller Product - ${product.productCode}">
                            </div>
                            <p class="product-name">${product.name}</p>
                            <p class="product-price">R ${productPrice}</p>
                            <div class="product-divider"></div>
                        </a>`
                    );
                    // // Insert Product Promo
                    // if (product.promo !== "") {
                    //     $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${productID}`)
                    // }
                }
            });
            $('.home-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
            })
        })
        .catch(err => {
            console.log(err);
        });
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
    $('.home-slick').slick("slickNext");
});
$("#slick-prev").click(() => {
    $('.product-slick').slick("slickPrev");
    $('.home-slick').slick("slickPrev");
})