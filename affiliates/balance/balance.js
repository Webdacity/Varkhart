const api_url = "https://varkhart-backend.herokuapp.com"
// const api_url = "http://localhost:3000"

const checkAffiliateBalance = () => {
    event.preventDefault();
    let affiliateCode = $("#affiliate-balance-code").val();

    if (affiliateCode.includes("?")) {
        affiliateCode = affiliateCode.replace("?", "");
    }

    console.log(affiliateCode);

    showLoader();

    axios({
            method: "post",
            url: `${api_url}/affiliates/checkBalance`,
            data: {
                code: affiliateCode
            }
        })
        .then(result => {
            console.log(result);
            hideLoader()
            notify("Hou jou e-pos dop vir 'n email met jou balans.")
        })
        .catch(error => {
            hideLoader()
            notify("'n Affiliaat met hierdie kode bestaan nie. Is jou kode korrek?")
            console.log(error)
        })
}


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