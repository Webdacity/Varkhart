// const api_url = "https://varkhart-backend.herokuapp.com"
const api_url = "http://localhost:3000"

$(document).ready(() => {

    // Load Templates

    $.get("./footer.html", function (data) {
        $("#footer").html(data)
    });

    //  Animations

    $(".search-button").hover(
        function () {
            $(this).children().toggleClass("far");
            $(this).children().toggleClass("fas");
        },
        function () {
            $(this).children().toggleClass("fas");
            $(this).children().toggleClass("far");
        }
    );

    updateCartCounter();
    getShopSettings();
});

// Shop Settings
async function getShopSettings() {
    let getSettings = axios({
        method: "get",
        url: `${api_url}/shopSettings/`,
    })
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.log(error)
        })

    let shopSettings = await getSettings;
    localStorage.setItem("shopSettings", JSON.stringify(shopSettings));
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
// Nav Search


const navSearch = () => {
    const searchTerm = $(".search-bar input").val();
    console.log("search :" + searchTerm)
    location.replace(`./winkel.html?${searchTerm}`);
}

// const mobileSearch = () => {
//     const searchTerm = $(".mobile-nav .search-bar input").val();
//     console.log("search :" + searchTerm)
//     location.replace(`./winkel.html?${searchTerm}`);
// }

$(".search-bar").on("submit", function (event) {
    event.preventDefault();
    navSearch();
});



// Mobile Nav {
$(".navbar-toggler, .mobile-nav-close").click(function () {
    $(".mobile-nav").toggleClass("mobile-nav-open");
    $("body, html").toggleClass("nav-no-scroll");
})



// Price Slider
if (window.location.pathname === "/winkel.html") {
    var lowerSlider = document.querySelector('#lower'),
        upperSlider = document.querySelector('#upper'),
        lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    upperSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);

        if (upperVal < lowerVal + 4) {
            lowerSlider.value = upperVal - 4;

            if (lowerVal == lowerSlider.min) {
                upperSlider.value = 4;
            }
        }
    };

    lowerSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);

        if (lowerVal > upperVal - 4) {
            upperSlider.value = lowerVal + 4;

            if (upperVal == upperSlider.max) {
                lowerSlider.value = parseInt(upperSlider.max) - 4;
            }

        }
    };

    const rangeWidth = $(".card-price").width();
    $(".multi-range input[type=range]").width(rangeWidth * 0.85)
}


// Loader

const showLoader = () => {
    $(".loader-container").fadeIn(500)
}
const hideLoader = () => {
    $(".loader-container").fadeOut(500)
}

$(".notify-bar").hide();

const notify = (text) => {
    $(".notify-bar p").html(text);
    $(".notify-bar").fadeIn(500, () => {
        setTimeout(() => {
            $(".notify-bar").fadeOut(500)
        }, 2000);
    })
}

// Get Affiliate Code
const getAfflCode = () => {
    let cookies = document.cookie;
    if (cookies.includes("afflCode")) {
        cookies = cookies.split("; ");
        let afflCode;
        if (cookies.length === 1) {
            afflCode = cookies[0].substring(cookies[0].indexOf("=") + 1, cookies[0].length);
            return afflCode
        } else {
            afflCode = cookies.find(cookie => cookie.includes("afflCode"));
            afflCode = afflCode.replace("afflCode=", "");
            return afflCode
        }
    } else {
        return undefined
    }
}

// Submit Newsletter Modal Form

const newsletterModalSubmit = () => {
    $('#newsletter-modal').modal('toggle');
    event.preventDefault();

    // Validate Email
    let email = $(".newsletter-modal-form [name='email']").val();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()) === false) {
        alert("Please enter a valid email address");
    } else {
        showLoader()
        axios({
            method: "post",
            url: `${api_url}/coupons/create/customer`,
            data: {
                "email": $(".newsletter-modal-form [name='email']").val(),
                "first_name": $(".newsletter-modal-form [name='name']").val(),
                "phone": $(".newsletter-modal-form [name='phone']").val(),
            }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    hideLoader();
                    $('#newsletter-modal-submit').modal('toggle');
                    $('#newsletter-modal-submit p').html("Jy is 'n legende! <br/><br/>  Jy sal jou afslagkode ontvang per sms. <br/><br/> Hou ook 'n oog op jou e-pos vir ons nuusbriewe.");
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 400) {
                    hideLoader();
                    $('#newsletter-modal-submit').modal('toggle');
                    $('#newsletter-modal-submit p').html("Slegs een afslagkode per koper word toegelaat. <br/><br/> Jy is wel ingeskryf vir ons nuusbrief!");
                }
            })
    }
}

const openNewsletterModal = () => {
    showLoader()
    $('#newsletter-modal').modal('toggle');
    getShopSettings().then(() => {
        hideLoader();
        let shopSettings = JSON.parse(localStorage.getItem("shopSettings"));
        $("#newsletter-coupon-value").html(`${shopSettings.subscriptionCouponValue}%`);
    })
}


// -------------------------

// Category Page

const showCategory = (category) => {
    console.log(category)
    $(".gender-blocks-section").fadeOut()
    $(`#categorySection${category}`).fadeIn()
}
