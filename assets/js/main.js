const api_url = "https://varkhart-backend.herokuapp.com"

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
        showLoader()
        axios({
                method: "post",
                url: "https://varkhart-backend.herokuapp.com/sendgrid/newsletter",
                data: {
                    "email": $(".newsletter-form [name='email']").val(),
                    "first_name": $(".newsletter-form [name='name']").val(),
                }
            })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    hideLoader();
                    notify("Jy is 'n legende! Hou 'n oog op jou e-pos vir ons nuusbriewe")
                }
            })
            .catch(error => {
                console.log(error)
            })
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
                url: `${api_url}/sendgrid/newsletter`,
                data: {
                    "email": $(".newsletter-modal-form [name='email']").val(),
                    "first_name": $(".newsletter-modal-form [name='name']").val(),
                }
            })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    hideLoader();
                    notify("Jy is 'n legende! Hou 'n oog op jou e-pos vir ons nuusbriewe")
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}