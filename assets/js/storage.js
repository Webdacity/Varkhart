// UTILS

const notify = (text) => {
    $(".notify-bar p").html(text);
    $(".notify-bar").height("unset",
        setTimeout(() => {
            $(".notify-bar").height("0px")
        }, 4000)
    );
}

// Clear Cart Storage
const clearCart = () => {
    localStorage.clear();
    console.log("Cleared. Current Cart:" + localStorage.getItem("cart"));
    updateCartCounter();
}

const showCart = () => {
    console.log("Current Cart:" + localStorage.getItem("cart"));
}

// CART FUNCTIONS

// Load Cart with Items from Storage
const loadCart = () => {
    let cartArray = JSON.parse(localStorage.getItem("cart"));

    // Empty Cart
    if (cartArray == null) {
        $(".cart-content").hide();
        $(".cart-empty").fadeIn();
    } else if (cartArray.length == 0) {
        $(".cart-content").hide();
        $(".cart-empty").fadeIn();
    } else {
        let productIDs = cartArray.map(function (item) {
            return item.id
        });
        let initialCartTotal = 0;

        // Read Cart Item Info from JSON
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);

                // Insert HTML
                for (i = 0; i < productIDs.length; i++) {
                    let productID = productIDs[i];
                    const product = response[productID]
                    initialCartTotal += product.price;

                    // Actual Cart
                    $(".cart-content-item-grid").append(
                        ` <div class="cart-content-item row d-flex align-items-center" id="cart-item-${i+1}">
                        <template id=${productID}></template>
                        <div class="col-3 col-md-4">
                            <div class="col-md-12">
                                <div class="row d-flex align-items-center">
                                    <div class="col-sm-3 cart-content-image-container">
                                        <img src="./assets/images/products/${productID}/1.png" alt=""
                                            class="img-fluid">
                                    </div>
                                    <div class="col-sm-9">
                                        <a class="cart-content-item-name" href="./produk.html#${productID}">${product.name}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-9 col-md-8 d-flex">
                            <div class="col-md-3">
                                <p class="cart-content-price">
                                    R <span>${product.price}</span>
                                </p>
                            </div>
                            <div class="col-md-3">
                                <p class="cart-content-size">
                                ${cartArray[i].size}
                                </p>
                            </div>
                            <div class="col-md-3">
                                <div class="cart-content-quantity">
                                    <i class="far fa-minus minus"></i>
                                    <input type="number" value="1" disabled class="cart-content-quantity-input">
                                    <i class="far fa-plus plus"></i>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <p class="cart-content-total">
                                    R <span>${product.price}</span>
                                </p>
                            </div>
                        </div>
                        <div class="cart-content-item-delete">
                        <i class="fal fa-times"></i>
                    </div>
                    </div>`
                    );
                }
                $(".cart-content-totals h4 span").html(initialCartTotal);
            }

        }
        xhttp.open("GET", "./assets/js/products.json", true);
        xhttp.send();
    }
}

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

// Cart Storage

const addToCart = () => {
    // Get Product ID:
    let productID = window.location.hash; //Get Recipe ID
    productID = productID.substr(1); //Remove #

    // // Get Product Size
    const productSize = $(".active-size").html();

    // Get Current Cart
    console.log("before: " + localStorage.getItem("cart"));
    let currentCart = JSON.parse(localStorage.getItem("cart"));

    // Add new Item
    let newItem = {
        id: productID,
        size: productSize
    }

    if (currentCart == null) {
        currentCart = [newItem];
    } else {
        currentCart.push(newItem);
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    console.log("Cart Updated. New Cart: " + localStorage.getItem("cart"));
    updateCartCounter();
    notify("Bygevoeg in Mandjie");
}

$(".product-add-cart").click(() => {
    if (!$(".product-page-sizes-buttons > *").hasClass("active-size")) {
        notify("Kies eers 'n Grootte!");
        $(".product-page-sizes-buttons span").addClass("choose-size-flash")
    } else {
        addToCart();
    }
});


// Delete Cart Items
$(document).on("click", ".cart-content-item-delete i", function () {
    deleteCartItem($(this))
});

const deleteCartItem = (item) => {
    // Get Info & Cart
    const currentID = getCartItemID(item);
    const cartProductID = getCartItemProductID(currentID);
    let currentCart = JSON.parse(localStorage.getItem("cart"));

    // Delete Item
    var removeIndex = currentCart.map(function (item) {
        return item.id;
    }).indexOf(cartProductID);
    currentCart.splice(removeIndex, 1);

    localStorage.setItem("cart", JSON.stringify(currentCart));
    updateCartCounter();
    showCart();
    notify("Produk Verwyder");

}


$(document).ready(function () {

    if (window.location.pathname == "/mandjie.html") {
        loadCart();
        updateCartCounter();
    }
});