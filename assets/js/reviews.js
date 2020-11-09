
// Get Reviews
const getReviews = () => {
    showLoader();
    axios({
        method: "get",
        url: `${api_url}/reviews/public`,
    }).then(response => {
        console.log(response);
        loadReviews(response.data)
    })
        .catch(err => {
            console.log(err);
        });
}

const loadReviews = (reviews) => {
    hideLoader();

    reviews.forEach(review => {
        $(".reviews-grid").prepend(`
        <div class="reviews-grid-item">
        <div class="header">
            <h4>${review.name}</h4>
            <div class="rating">
                <i class="material-icons ${review.rating >= 1 ? "active" : ""}">star_rate</i>
                <i class="material-icons ${review.rating >= 2 ? "active" : ""}">star_rate</i>
                <i class="material-icons ${review.rating >= 3 ? "active" : ""}">star_rate</i>
                <i class="material-icons ${review.rating >= 4 ? "active" : ""}">star_rate</i>
                <i class="material-icons ${review.rating === 5 ? "active" : ""}">star_rate</i>
            </div>
        </div>
        <p>${review.text}</p>
    </div>
   `);
    })
}

getReviews()