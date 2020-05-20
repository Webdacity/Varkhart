// Get Affiliate Code

let currentCookies = document.cookie;

// Check if cookie already exists
if (currentCookies.includes("afflCode")) {
    window.location.replace("../index.html");
} else {
    const url = window.location.href;
    if (url.includes("?")) {
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
                console.log(error)
            })
    }

    //  If No Code in url
    else {
        window.location.replace("../index.html");
    }
}