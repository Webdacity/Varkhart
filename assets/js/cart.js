// Cart Storage


const addToCart = () => {
    // Get Product ID:
    let productID = window.location.hash; //Get Recipe ID
    productID = productID.substr(1); //Remove #
    oldCart = localStorage.getItem("cartProducts");

    let currentCart = [];

    // Check Cart not Empty
    if (oldCart == null) {
        currentCart.push(productID)
    } else if (oldCart.indexOf(",") < 0) {
        console.log("one tiem");
        currentCart = oldCart.split();
        currentCart.push(productID);
    } else {
        currentCart = oldCart.split(",")
        currentCart.push(productID);
    }
    console.log(currentCart);

    localStorage.setItem("cartProducts", currentCart.toString());

    // AddCart Notfications
    localStorage.setItem("cartSize", 1);

    console.log(localStorage.getItem("cartProducts"));
}

// Clear Cart Storage
const clearCart = () => {
    localStorage.clear();
    console.log("Cleared. Current Cart:" + localStorage.getItem("cartProducts"))
}

const showCart = () => {
    console.log("Current Cart:" + localStorage.getItem("cartProducts"))

}


// Load Cart with Items from Storage
const loadCart = () => {
    let cartItemIDsToLoad = localStorage.getItem("cartProducts");
    let initialCartTotal = 0;

    // Check Cart not Empty
    if (cartItemIDsToLoad == null) {
        $(".cart-content").hide();
        $(".cart-empty").fadeIn();
    } else {
        cartItemIDsToLoad = cartItemIDsToLoad.split(",");

        // Read Cart Item Info from JSON
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);

                // Insert HTML
                for (i = 0; i < cartItemIDsToLoad.length; i++) {
                    let productID = cartItemIDsToLoad[i];
                    const product = response[productID]
                    initialCartTotal += product.price;
                    $(".cart-content-item-grid").append(
                        ` <div class="cart-content-item row d-flex align-items-center" id="cart-item-${i+1}">
                        <template id=${productID}></template>
                        <div class="col-sm-4">
                            <div class="row d-flex align-items-center">
                                <div class="col-sm-3">
                                    <img src="./assets/images/products/${productID}/1.png" alt=""
                                        class="img-fluid cart-content-image">
                                </div>
                                <div class="col-sm-9">
                                    <a class="cart-content-item-name" href="./produk.html#${productID}">${product.name}</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <p class="cart-content-price">
                                R <span>${product.price}</span>
                            </p>
                        </div>
                        <div class="col-sm-1">
                            <p class="cart-content-size">
                                XL
                            </p>
                        </div>
                        <div class="col-sm-2">
                            <div class="cart-content-quantity">
                                <i class="far fa-minus minus"></i>
                                <input type="number" value="1" disabled class="cart-content-quantity-input">
                                <i class="far fa-plus plus"></i>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <p class="cart-content-total">
                                R <span>${product.price}</span>
                            </p>
                        </div>
                        <div class="col-sm-1">
                            <p class="cart-content-item-delete">
                                <i class="fal fa-times"></i>
                            </p>
                        </div>
                    </div>`
                    );

                    $(".cart-content-totals h4 span").html(initialCartTotal);

                }
            }

        }
        xhttp.open("GET", "./assets/js/products.json", true);
        xhttp.send();
    }
    // calcCartTotal();

}



// Load Cart
loadCart();

// Calculate Cart Total
function calcCartTotal() {
    let totalCart = 0;
    let currentItemTotal = 0;
    const cartSize = $(".cart-content-item-grid > div").length;
    for (i = 1; i <= getCartSize(); i++) {
        currentItemTotal = parseInt($(`#cart-item-${i}`).find(".cart-content-total span").html());
        totalCart += currentItemTotal;
    }
    $(".cart-content-totals h4 span").html(totalCart);
}

// Cart Quantity + Total Counter
const getCartItemID = (item) => {
    const id = $(item).closest(".cart-content-item").attr("id");
    return id;
}

// Get Current Cart Size
function getCartSize() {
    return $(".cart-content-item-grid > div").length;
}

// Load Empty Cart Div
const loadEmptyCart = (time) => {
    if (getCartSize() < 1) {
        if (getCartSize() < 1) {
            if (time > 0) {
                $(".cart-content").fadeOut(time, function () {
                    $(".cart-empty").fadeIn();
                });
            } else {
                $(".cart-content").hide();
                $(".cart-empty").fadeIn();
            }
        }
    }
}

// Update Item Specific Totals
function updateItemTotal(itemID, quantity) {
    const price = $(`#${itemID}`).find(".cart-content-price span").html();
    $(`#${itemID}`).find(".cart-content-total span").html(price * quantity);
}


// Adjust Quantity
$(document).on("click", ".cart-content-quantity .plus", function () {
    const currentID = getCartItemID($(this));

    let quant = $(this).prev().val();
    quant++;
    $(this).prev().val(quant);

    updateItemTotal(currentID, quant);
    calcCartTotal();
});

$(document).on("click", ".cart-content-quantity .minus", function () {
    const currentID = getCartItemID($(this));

    let quant = $(this).next().val();
    if (quant > 1) {
        quant--;
    }
    $(this).next().val(quant);

    updateItemTotal(currentID, quant);
    calcCartTotal();
});

// Get Cart Item Product ID
const getCartItemProductID = (itemID) => {
    return $(`#${itemID} template`).attr("id");
}


// Delete Cart Items
$(document).on("click", ".cart-content-item-delete i", function () {
    const currentID = getCartItemID($(this));
    const cartProductID = getCartItemProductID(currentID)

    // Clear Storage
    let newCart = [];
    let oldCart = localStorage.getItem("cartProducts");
    if (oldCart !== null) {
        newCart = oldCart.split(",")
    }
    newCart.splice(newCart.indexOf(cartProductID), 1);
    localStorage.setItem("cartProducts", newCart)

    $(`#${currentID}`).remove();

    // Refactor Cart ID's
    for (i = 1; i <= getCartSize(); i++) {
        $(`.cart-content-item:nth-child(${i})`).attr("id", `cart-item-${i}`)
    }
    // Show Empty Cart Info
    loadEmptyCart(500);
    calcCartTotal();
});