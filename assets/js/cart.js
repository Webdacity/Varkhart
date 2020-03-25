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
        const itemQuant = $(`#cart-item-${i} .cart-content-quantity-input`).val();
        const itemPrice = $(`#cart-item-${i} .cart-content-total span`).html();
        const itemId = $(`#cart-item-${i} template`).attr("id");

        $(".cart-details-list").append(`
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                 <div>
                 <a class="my-0" href="./produk.html#${itemId}">${itemName}</a>
                  <small class=text-muted">${itemQuant} | ${itemSize}</small>
              </div>
              <p>R ${itemPrice}</p>
            </li>
           `);
    }


    $(".checkout-cart-count").html(cartLength);
    $(".checkout-total h5").html(`R ${cartTotal+100}`); // {Incl Delivery}

    loadPayButton();
}

const loadPayButton = () => {

}