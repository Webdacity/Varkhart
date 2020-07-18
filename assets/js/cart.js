// SETTINGS

const deliveryFee = 117;
const affiliateShare = 200 //Cents

// -------------------------


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
    console.log(id)
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

    // Update Cart Storage Quantity
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let currentProductID = $(`#${itemID} template`).attr("id");
    let currentProductSize = $(`#${itemID} .cart-content-size`).html();
    let currentProductQuant = parseInt($(`#${itemID} .cart-content-quantity-input`).val());
    currentCart.forEach(item => {
        if (item.id == currentProductID && item.size == currentProductSize) {
            console.log("found")
            item.quantity = currentProductQuant;
        }
    });
    localStorage.setItem("cart", JSON.stringify(currentCart));
    showCart()
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
        const itemSize = $(`#cart-item-${i} .cart-content-size`).html();
        const itemColor = $(`#cart-item-${i} .cart-content-color`).html();
        const itemQuant = $(`#cart-item-${i} .cart-content-quantity-input`).val();
        const itemPrice = $(`#cart-item-${i} .cart-content-total span`).html();
        const itemId = $(`#cart-item-${i} template`).attr("id");

        $(".cart-details-list").append(`
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                 <div>
                 <a class="my-0" href="./produk.html#${itemId}">${itemName}</a>
                  <small class=text-muted">${itemQuant} | ${itemSize} ${itemColor}</small>
              </div>
              <p>R ${itemPrice}</p>
            </li>
           `);
    }


    $(".checkout-cart-count").html(cartLength);
    $(".checkout-total h5 span").html(`${cartTotal+deliveryFee}`); // {Incl Delivery}
}

// CART UTILS

// Clear Cart Storage
const clearCart = () => {
    localStorage.clear();
    console.log("Cleared. Current Cart:" + localStorage.getItem("cart"));
    updateCartCounter();
}

const showCart = () => {
    console.log("Current Cart:" + localStorage.getItem("cart"));
}

// Check if Cart is Empty
const checkCartEmpty = () => {
    currentCart = JSON.parse(localStorage.getItem("cart"));
    if (currentCart === null || currentCart.length < 1) {
        $(".cart-content").hide();
        $(".cart-empty").fadeIn();
        hideLoader();
        return true
    }
}

// CART FUNCTIONS

// Load Cart with Items from Storage
const loadCart = () => {
    showLoader()
    if (!checkCartEmpty()) {
        let cartArray = JSON.parse(localStorage.getItem("cart"));

        let productCodes = [];
        cartArray.forEach(item => {
            productCodes.push(item.id)
        });
        let initialCartTotal = 0;

        axios.get(`${api_url}/products`)
            .then((response) => {
                const products = response.data;
                let counter = 0;

                // Ensure Cart in same format as localStorage cart
                productCodes.forEach(code => {
                    let productFound = products.find(product => product.productCode === code);
                    if (productFound !== undefined && productFound.visibility) {
                        product = products[products.indexOf(productFound)];
                        let productPrice;
                        if (product.discount !== null) {
                            productPrice = product.price - product.discount;
                        } else {
                            productPrice = product.price
                        }
                        initialCartTotal += productPrice * cartArray[counter].quantity;
                        // Actual Cart
                        $(".cart-content-item-grid").append(
                            `
                                <div class="cart-content-item container d-flex align-items-center" id="cart-item-${counter+1}"
                                    data-cart-item-price=${productPrice}>
                                    <template id=${product.productCode}></template>
                                    <div class="4 col-md-1 cart-content-image-container">
                                        <img src="${product.productThumbnailUrl}" alt="Varkhart Cart Item" class="img-fluid">
                                    </div>
                                    <div class="col-md-3">
                                        <div class="d-flex flex-column">
                                            <a class="cart-content-item-name" href="./produk.html#${product.productCode}">${product.name}</a>
                                            <div>
                                            <small class="text-muted cart-content-size">${cartArray[counter].size}</small>
                                            <small class="text-muted cart-content-color">| ${product.color}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="offset-md-0 col-md-8 d-flex align-items-center">
                                        <div class="col-md-3 offset-md-5">
                                            <div class="cart-content-quantity">
                                                <i class="far fa-minus minus"></i>
                                                <input type="number" value="${cartArray[counter].quantity}" disabled class="cart-content-quantity-input">
                                                <i class="far fa-plus plus"></i>
                                            </div>
                                        </div>
                                        <div class="col-md-3 mt-md-0">
                                            <p class="cart-content-total">
                                            R <span>${productPrice * cartArray[counter].quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="cart-content-item-delete">
                                        <i class="fal fa-times"></i>
                                    </div>
                                </div>`
                        );

                        $(".cart-content-totals h4 span").html(initialCartTotal);
                        counter++;
                    } else {
                        // Remove deleted / invisible product
                        let deletedProduct = cartArray.find(item => item.id === code);
                        console.log(deletedProduct)
                        cartArray.splice(cartArray.indexOf(deletedProduct), 1);
                        localStorage.setItem("cart", JSON.stringify(cartArray));
                        location.reload();
                    }
                });
                hideLoader();
            })
            .catch(err => {
                console.log(err);
            });
    }

}

// 




// Cart Storage

const searchCart = (productID, productSize) => {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let searchResults = 0;
    if (currentCart !== null) {
        currentCart.forEach(item => {
            if (item.id == productID && item.size == productSize) {
                searchResults++
            }
        })
    }
    return searchResults
}

const addToCart = () => {
    // Get Product ID:
    let productID = window.location.hash; //Get Recipe ID
    productID = productID.substr(1); //Remove #

    // // Get Product Size
    const productSize = $(".active-size").html();

    // Get Current Cart
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    console.log(currentCart)
    // Check if already in cart
    if (searchCart(productID, productSize) > 0) {
        notify("Produk is klaar n mandjie - Verander hoeveelheid in mandjie")
    } else {
        // Add new Item
        let newItem = {
            id: productID,
            size: productSize,
            quantity: 1
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
    let currentCartPosition = getCartItemID(item);
    // const cartProductID = getCartItemProductID(currentID);
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let cartPostition = currentCartPosition.slice(currentCartPosition.lastIndexOf("-") + 1, currentCartPosition.length);
    console.log(cartPostition)
    // Delete Item
    currentCart.splice(cartPostition - 1, 1);

    localStorage.setItem("cart", JSON.stringify(currentCart));
    updateCartCounter();
    showCart();
    notify("Produk Verwyder");
}

$(".cart-heading i").click(() => {
    clearCart();
    location.reload();
})


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


// Send POST to backend for validation

const sendOrder = () => {
    $('#delivery-modal').modal('hide');
    showLoader();
    // Get Cart List 
    const cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = [];
    cartKeys = Object.keys(cart);

    $(".order-form [name='custom_str4']").val(
        $(".order-form #order-straat-nommer").val() + ", " +
        $(".order-form #order-straat-naam").val() + ", " +
        $(".order-form #order-gebou-details").val() + ", " +
        $(".order-form #order-woongebied").val() + ", " +
        $(".order-form #order-stad").val() + ", " +
        $(".order-form #order-provinsie").val() + "," +
        $(".order-form #order-poskode").val()
    );

    $(".order-form [name='amount']").val(parseInt($(".checkout-total h5 span").html()));
    $(".order-form [name='merchant_id']").val("15264989");
    $(".order-form [name='merchant_key']").val("cjqavjznyhybl");
    $(".order-form [name='notify_url']").val(`${api_url}/orders/`);


    // SendGrid
    const orderConfirmation = {
        merchant_id: $(".order-form [name='merchant_id']").val(),
        email_address: $(".order-form [name='email_address']").val(),
        name_first: $(".order-form [name='name_first']").val(),
        name_last: $(".order-form [name='name_last']").val(),
        amount_gross: $(".order-form [name='amount']").val(),
        cell_number: $(".order-form #order-cell").val(),
        cart_items: JSON.parse(localStorage.getItem("cart")),
        delivery_address: $(".order-form [name='custom_str4']").val(),
        delivery_notes: $(".order-form [name='custom_str2']").val(),
        affiliateCode: getAfflCode()
    }

    axios({
            method: "post",
            url: `${api_url}/orders/confirmation`,
            data: orderConfirmation
        })
        .then(response => {
            if (response.status === 201) {
                $(".order-form [name='custom_str1']").val(response.data.order_number);

                // Affiliate Share
                if (orderConfirmation.affiliateCode !== undefined) {
                    const affiliateSettings = {
                        "split_payment": {
                            "merchant_id": response.data.affiliate_merchant_ID,
                            "amount": calculateAffiliateShare() * affiliateShare
                        }
                    }
                    $(".order-form [name='setup']").val(JSON.stringify(affiliateSettings));
                    $(".order-form").submit();
                    console.log("Payfast OK with Affiliate");
                    console.log(affiliateSettings)
                } else {
                    $(".order-form [name='setup']").remove();
                    $(".order-form").submit();
                    console.log("Payfast Ok No Affiliate")
                }
                console.log(response);
            } else {
                hideLoader()
                notify("Error Processing your transaction. Please contact Support")
            }
        })
        .catch(err => {
            console.log(err);
            hideLoader();
            notify("There seems to be an error processing your order. Please contact support.")
        });

}

// Show Delivery Notice
const showDeliveryNotice = () => {
    $('#delivery-modal').modal('toggle');
}

// Validate Form
const validateForm = (formToVal, callback) => {
    let form = document.getElementById(formToVal);
    let email = $(".order-form [name='email_address']").val();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.checkValidity() === false) {
        console.log("Validation Fail")
        event.preventDefault();
        event.stopPropagation();
    } else if (re.test(String(email).toLowerCase()) === false) {
        event.preventDefault();
        event.stopPropagation();
        alert("You email is invalid")
    } else {
        console.log("Validation Success")
        callback();
    }
    form.classList.add('was-validated');
}

// Calculate Affiliate Share
const calculateAffiliateShare = () => {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let totalItems = 0;

    currentCart.forEach(item => {
        totalItems += item.quantity;
    });

    return totalItems
}


$(document).ready(function () {
    if (window.location.pathname == "/mandjie.html") {
        loadCart();
        updateCartCounter();
    }
});