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

$(".review-rating div").click(function () {
    $(".review-rating div").removeClass("active");
    $(this).addClass("active")
})

const validateReviewForm = (formToVal, callback) => {
    event.preventDefault()
    let form = document.getElementById(formToVal);
    if (form.checkValidity() === false) {
        console.log("Validation Fail")
    } else if ($("#review-form .review-rating div").hasClass("active") === false) {
        alert("Jy het nie 'n gradering gekies nie.")
    } else {
        console.log("Validation Success")
        callback();
    }
    form.classList.add('was-validated');
};


// Submit Review

const submitReview = () => {
    showLoader();
    let order_number = window.location.hash.replace("#", "");
    order_number = order_number.length > 0 ? order_number : null

    const review = {
        name: $("#review-form input[name='name']").val(),
        text: $("#review-form textarea[name='text']").val(),
        rating: parseInt($("#review-form .review-rating div.active span").html()),
        order_number: order_number
    }
    console.log(review)
    axios({
        method: "post",
        url: `${api_url}/reviews`,
        data: review
    }).then(response => {
        hideLoader();
        showModal({
            heading: "Jou Resensie",
            text: "Baie dankie vir jou resensie. Dit help ons groei en nog meer Varkharte bymekaar bring!",
            buttonText: "Ok",
            buttonFunction: hideModal
        });
    })
        .catch(err => {
            console.log(err);
        });
}


// ----------------

// Modals
const showModal = (settings) => {
    $(".normal-modal").modal("toggle");
    $(".normal-modal .modal-title").html(settings.heading);
    $(".normal-modal .modal-body p").html(settings.text);
    $(".normal-modal .modal-footer button").html(settings.buttonText);
    $(".normal-modal .modal-footer button").off('click');;
    $(".normal-modal .modal-footer button").click(settings.buttonFunction);
}

const hideModal = () => {
    $(".normal-modal").modal("toggle");
    window.location.replace("../index.html")
}