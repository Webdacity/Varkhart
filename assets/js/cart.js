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
    $(`#${currentID}`).remove();

    // Refactor Cart ID's
    for (i = 1; i <= getCartSize(); i++) {
        $(`.cart-content-item:nth-child(${i})`).attr("id", `cart-item-${i}`)
    }
    // Show Empty Cart Info
    loadEmptyCart(500);
    calcCartTotal();
});