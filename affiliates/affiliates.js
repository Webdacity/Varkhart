// Get Affiliate Code

let currentCookies = document.cookie;

const saveCookie = (url) => {
    const affiliateCode = url.substring(url.indexOf("?") + 1, url.length);
    console.log(affiliateCode);

    axios({
            method: "post",
            url: `https://varkhart-backend.herokuapp.com/affiliates/checkStatus`,
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