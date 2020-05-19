// Get Affiliate Code
const url = window.location.href;
if (url.includes("?")) {
    const affiliateCode = url.substring(url.indexOf("?") + 1, url.length);
    console.log(affiliateCode);

    var fortnightAway = new Date(Date.now() + 12096e5);
    console.log(fortnightAway);
    document.cookie = `afflCode=${affiliateCode};expires=${fortnightAway.toGMTString()};path=/`;

    window.location.replace("/index.html")
}