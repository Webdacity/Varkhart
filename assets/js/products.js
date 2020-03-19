// Logic

// Insert Products in Store:
if (window.location.pathname == "/winkel.html") {

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
                let productName = product.name;
                let productPrice = product.price;

                // Insert HTML
                $(".shop-product-grid").append(
                    `<a class="col-sm-6 col-md-3 product" href="./produk.html#${productID}">
                    <img class="img-fluid" src="./assets/images/products/${productID}/1.png" alt="">
                    <p class="product-name">${productName}</p>
                    <p class="product-price">R ${productPrice}</p>
                </a>`
                );
            }
        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}



// Insert Products in Product Page:
if (window.location.pathname == "/produk.html") {

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
                    `<button class="active-size"> Een Grootte </button>`
                )
            } else {
                for (i = 0; i < sizes.length; i++) {
                    $(".product-page-sizes-buttons").append(
                        `<button>${sizes[i]}</button>`
                    )
                }
            }



            // Colors
            const colors = product.colors;

            if (colors.length == 0) {
                $(".product-page-colours").remove();
            } else {
                for (i = 0; i < colors.length; i++) {
                    $(".product-page-colours").append(
                        `<div style="background-color:${colors[i]}"> </div>`
                    )
                }
            }

        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}