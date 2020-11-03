// const api_url = "https://varkhart-backend.herokuapp.com"
const api_url = "http://localhost:3000"


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


// GET Coupon Code

const couponID = window.location.hash.replace("#", "");
showLoader()
axios({
    method: "get",
    url: `${api_url}/coupons/getCode/${couponID}`,
}).then(response => {

    const coupon = response.data;
    $(".section-coupon-view h2 span").html(coupon.value);
    $(".section-coupon-view h3").html(coupon.code);
    hideLoader()
})
    .catch(err => {
        console.log(err);
        alert("Hierdie Kode bestaan nie op ons sisteem nie.");
        window.location.replace("../../index.html")
    });