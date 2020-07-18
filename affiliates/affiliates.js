const api_url = "https://varkhart-backend.herokuapp.com"
// const api_url = "http://localhost:3000"


// GENERAL UI & Logic

const showLoader = () => {
    $(".loader-container").fadeIn(500)
}
const hideLoader = () => {
    $(".loader-container").fadeOut(500)
}

const validateForm = (formToVal, callback) => {
    event.preventDefault()
    let form = document.getElementById(formToVal);
    let email = $(`#${formToVal} input[name='email']`).val();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.checkValidity() === false) {
        console.log("Validation Fail")
    } else if (re.test(String(email).toLowerCase()) === false) {
        alert("You email is invalid")
    } else if ($(`#${formToVal} input[name='merchantID']`).val().length < 8) {
        alert("Your merchant ID must be at least 8 numbers long")
    } else {
        console.log("Validation Success")
        callback();
    }
    form.classList.add('was-validated');
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ----------------------------------

// COOKIE MANAGEMENT

// Get Affiliate Code
const saveAffiliateCode = () => {

    let currentCookies = document.cookie;

    const saveCookie = (url) => {
        const affiliateCode = url.substring(url.indexOf("?") + 1, url.length);
        console.log(affiliateCode);

        axios({
                method: "post",
                url: `${api_url}/affiliates/checkStatus`,
                data: {
                    code: affiliateCode
                }
            })
            .then(result => {
                console.log(result.status)
                // Check if Affiliate Active

                if (result.data === true) {
                    var fortnightAway = new Date(Date.now() + 12096e5);
                    document.cookie = `afflCode=${affiliateCode};expires=${fortnightAway.toGMTString()};path=/`;
                    window.location.replace("../index.html");
                } else {
                    window.location.replace("../index.html");
                }

            })
            .catch(error => {
                window.location.replace("../index.html");
                console.log(error)
            })
    }

    // Check if cookie already exists
    if (currentCookies.includes("afflCode")) {
        window.location.replace("../index.html");
    } else {
        let url = window.location.href;

        if (url.includes("&fbclid")) {
            url = url.substring(0, url.indexOf("&fbclid"));
            console.log(url)
            saveCookie(url)
        } else if (url.includes("%20")) {
            console.log("space");
            url = url.replace("%20", "");
            console.log(url);
            saveCookie(url)
        } else {
            if (url.includes("?")) {
                saveCookie(url)
            }

            //  If No Code in url
            else {
                window.location.replace("../index.html");
            }
        }
    }
}


// --------------------------
// AFFILIATE SIGN-UP

// Show Form after Payfast Info Check
$(".sign-up-accept-button").click(() => {
    $(".sign-up-payfast-info").fadeOut();
    $(".sign-up-form").fadeIn();
});

// save Affiliate

const saveAffiliate = () => {
    showLoader();
    event.preventDefault();
    const affiliate = {
        merchantID: $("#affiliate-sign-up-form input[name='merchantID']").val(),
        first_name: capitalizeFirstLetter($("#affiliate-sign-up-form input[name='first_name']").val()),
        last_name: $("#affiliate-sign-up-form input[name='last_name']").val(),
        email: $("#affiliate-sign-up-form input[name='email']").val(),
        phone: $("#affiliate-sign-up-form input[name='phone']").val()
    }

    axios({
            method: "post",
            url: `${api_url}/affiliates/`,
            data: affiliate
        })
        .then(result => {
            console.log(result);
            hideLoader();
            $('#affiliate-sign-up-modal .modal-body p span').html(result.data.affiliate.first_name)
            $('#affiliate-sign-up-modal').modal('toggle');
        })
        .catch(error => {
            hideLoader()
            console.log(error)
        })
}