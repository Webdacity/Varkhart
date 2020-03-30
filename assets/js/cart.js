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
const loadEmptyCart = () => {
    if (getCartSize() < 1) {
        $(".cart-content").hide();
        $(".cart-empty").fadeIn();
    }
}

// Update Item Specific Totals
function updateItemTotal(itemID, quantity) {
    const price = $(`#${itemID}`).attr("data-cart-item-price");
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
    $(`#${currentID}`).remove();

    // Refactor Cart ID's
    for (i = 1; i <= getCartSize(); i++) {
        $(`.cart-content-item:nth-child(${i})`).attr("id", `cart-item-${i}`)
    }
    // Show Empty Cart Info
    calcCartTotal();
    loadEmptyCart();
});



// Buyer Details

// Checkout Cart


$(".cart-options-continue").click(() => {
    $(".cart-section").fadeOut(500, () => {
        $(".cart-details").fadeIn();
    });
    checkoutCart();
});

const checkoutCart = () => {

    $(".cart-details-list").empty();
    const cartLength = $(".cart-content-item-grid").children().length;
    const cartTotal = parseInt($(".cart-content-totals span").html());
    for (i = 1; i <= cartLength; i++) {
        const itemName = $(`#cart-item-${i} .cart-content-item-name`).html();
        const itemColorSize = $(`#cart-item-${i} .cart-content-color-size`).html();
        const itemQuant = $(`#cart-item-${i} .cart-content-quantity-input`).val();
        const itemPrice = $(`#cart-item-${i} .cart-content-total span`).html();
        const itemId = $(`#cart-item-${i} template`).attr("id");

        $(".cart-details-list").append(`
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                 <div>
                 <a class="my-0" href="./produk.html#${itemId}">${itemName}</a>
                  <small class=text-muted">${itemQuant} | ${itemColorSize}</small>
              </div>
              <p>R ${itemPrice}</p>
            </li>
           `);
    }


    $(".checkout-cart-count").html(cartLength);
    $(".checkout-total h5").html(`R ${cartTotal+100}`); // {Incl Delivery}
}

// UTILS

const notify = (text) => {
    $(".notify-bar p").html(text);
    $(".notify-bar").height("unset",
        setTimeout(() => {
            $(".notify-bar").height("0px")
        }, 3000)
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
                        `
                    <div class="cart-content-item container d-flex align-items-center" id="cart-item-${i+1}"
                        data-cart-item-price=${product.price}>
                        <template id=${productID}></template>
                        <div class="4 col-md-1 cart-content-image-container">
                            <img src="./assets/images/products/${productID}/1-thumb.png" alt="Varkhart Cart Item" class="img-fluid">
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex flex-column">
                                <a class="cart-content-item-name" href="./produk.html#${productID}">${product.name}</a>
                                <small class="text-muted cart-content-color-size">${cartArray[i].size}  | ${product.color} </small>
                            </div>
                        </div>
                        <div class="offset-md-0 col-md-8 d-flex align-items-center">
                            <div class="col-md-3 offset-md-5">
                                <div class="cart-content-quantity">
                                    <i class="far fa-minus minus"></i>
                                    <input type="number" value="1" disabled class="cart-content-quantity-input">
                                    <i class="far fa-plus plus"></i>
                                </div>
                            </div>
                            <div class="col-md-3 mt-md-0">
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
        xhttp.open("GET", "./assets/js/products.json", false);
        xhttp.send();
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

$(".cart-heading i").click(() => {
    clearCart();
    location.reload();
})