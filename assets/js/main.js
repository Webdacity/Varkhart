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
});

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

// Submit Newsletter Form
const newsletterSubmit = () => {
    event.preventDefault();

    // Validate Email
    let email = $(".newsletter-form [name='email']").val();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()) === false) {
        alert("Please enter a valid email address");
    } else {
        axios({
                method: "put",
                url: "https://api.sendgrid.com/v3/marketing/contacts",
                headers: {
                    "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
                    // "Authorization": `Bearer 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`,
                    "Content-Type": "application/json"
                },
                data: {
                    "list_ids": [
                        "52a6677b-23a5-41b1-b01f-9709c1c47d36"
                    ],
                    "contacts": [{
                        "email": $(".newsletter-form [name='email']").val(),
                        "first_name": $(".newsletter-form [name='name']").val(),
                    }]
                }
            })
            .then(result => {
                if (result.status === 202) {
                    console.log(result);
                    alert("Jy is 'n legende! Hou 'n oog op jou e-pos vir ons nuusbriewe")
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

}