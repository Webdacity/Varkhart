const api_url = "https://varkhart-backend.herokuapp.com"
// const api_url = "http://localhost:3000"


// ----------------------

// UI


// Notify
$(".notify-bar").hide();

const notify = (text) => {
    $(".notify-bar p").html(text);
    $(".notify-bar").fadeIn(500, () => {
        setTimeout(() => {
            $(".notify-bar").fadeOut(500)
        }, 2000);
    })
}

const showLoader = () => {
    $(".loader-container").fadeIn(500)
}
const hideLoader = () => {
    $(".loader-container").fadeOut(500)
}


// GET ORDER STATUS
const statusMessages = {
    "RECEIVED": "Bestelling Ontvang",
    "SOURCING": "Bestelling word Vervoer vanaf Fabriek",
    "PACKING": "Bestelling word Verpak",
    "SHIPPING": "Bestelling is Verskeep na Afleweringsadres"
}

const orderNumber = window.location.hash.replace("#", "");
showLoader()
axios({
        method: "get",
        url: `${api_url}/orders/getStatus/${orderNumber}`
    }).then(response => {

        const shipping_status = response.data;
        $(".section-order-track h1").html(`Bestelling #${orderNumber} Status:`);
        $(".section-order-track h4").html(statusMessages[shipping_status]);
        $(`#order-status-item-${shipping_status.toLowerCase()}, #order-status-line-${shipping_status.toLowerCase()}`).addClass("active");
        hideLoader()
    })
    .catch(err => {
        console.log(err);
        alert("Hierdie Bestelling bestaan nie op ons sisteem nie.");
        window.location.replace("../../index.html")
    });