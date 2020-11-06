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

$(".review-rating span").click(function () {
    $(".review-rating span").removeClass("active");
    $(this).addClass("active")
})

const validateReviewForm = (formToVal, callback) => {
    event.preventDefault()
    let form = document.getElementById(formToVal);
    if (form.checkValidity() === false) {
        console.log("Validation Fail")
    } else if ($("#review-form .review-rating span").hasClass("active") === false) {
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

    const review = {
        name: $("#review-form input[name='name']").val(),
        text: $("#review-form textarea[name='text']").val(),
        rating: parseInt($("#review-form .review-rating span.active").html())
    }
    console.log(review)
    axios({
        method: "post",
        url: `${api_url}/reviews`,
        data: review
    }).then(response => {
        hideLoader();
        notify("Baie dankie vir jou resensie. Dit help ons groei en nog meer Varkharte bymekaar bring!");
    })
        .catch(err => {
            console.log(err);
        });
}