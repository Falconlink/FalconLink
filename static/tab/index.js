var isProxied = true;

if (window.parent.location.pathname.startsWith("/games") || window.parent.location.pathname.startsWith("/apps")) {
    document.getElementById("homeButton").style.display = "block";
}
function toggle() {
  var dropdownContent = document.querySelector(".dropdown-content");
  if (dropdownContent.style.visibility === "visible") {
    dropdownContent.style.visibility = "hidden";
    dropdownContent.style.opacity = 0;
    dropdownContent.style.transform = "translateY(-20px)";
  } else {
    dropdownContent.style.visibility = "visible";
    dropdownContent.style.opacity = 1;
    dropdownContent.style.transform = "translateY(0)";
  }
}

function openEruda() {
    const iframe = document.getElementById("uv-frame");
    el = document.createElement("script")
    el.src = "/tab/eruda.js";
    iframe.contentDocument.body.append(el);
}

function proxyFullscreen() {
    let elem = document.getElementById("uv-frame");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

document.getElementById("nav-bar-form").addEventListener("submit", function (event) {
    const address = document.getElementById("nav-bar-address");
    const searchEngine = document.getElementById("uv-search-engine");

    event.preventDefault();

    const url = search(address.value, searchEngine.value);

    let frame = document.getElementById("uv-frame");
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    document.getElementById("https-lock").innerText = "pending";
});

var lastURL = "";

document.getElementById("uv-frame").onload = function () {
    lastURL = "";
    updateURLBar();
}

setInterval(updateURLBar, 250);

function updateURLBar() {
    if (document.activeElement.id != "nav-bar-address" || lastURL != getTabURL()) {
        lastURL = getTabURL();
        if (document.getElementById("uv-frame").contentWindow.location.href == "about:blank") {
            document.getElementById("nav-bar-address").value = "about:blank";
        } else {
            document.getElementById("nav-bar-address").value = getTabURL();
            if (document.getElementById("nav-bar-address").value.startsWith("https://")) {
                document.getElementById("https-lock").innerText = "lock";
            } else if (document.getElementById("nav-bar-address").value.startsWith("http://")) {
                document.getElementById("https-lock").innerText = "lock_open_right";
            } else {
                document.getElementById("https-lock").innerText = "error";
            }
        }
    }
}

function getTabURL() {
    str = document.getElementById("uv-frame").contentWindow.location.href;
    if (isProxied) {
        str = decodeURIComponent(str.substring(str.lastIndexOf('/') + 1));
        return decodeURIComponent(
            str
                .toString()
                .split('')
                .map((char, ind) =>
                    ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
                )
                .join('')
        );
    } else {
        return str;
    }
}

function windowPopout() {
    var win = window.open();
    var iframe = win.document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.margin = 0;
    iframe.style.border = "none";
    iframe.src = document.getElementById("uv-frame").contentWindow.location.href;
    win.document.body.appendChild(iframe);
    win.document.body.style.margin = 0;
}

function goForward() {
    document.getElementById("uv-frame").contentWindow.history.forward();
}

function goBack() {
    document.getElementById("uv-frame").contentWindow.history.back();
}

function reloadPage() {
    document.getElementById("uv-frame").contentWindow.location.reload();
}

async function startProxy() {
    try {
        await registerSW();
    } catch (err) {
        alert("Error. Please contact a server administrator. Error Message: " + err.message)
    }

    let queryString = new URLSearchParams(window.location.search);
    var url = queryString.get("page");

    var proxy = queryString.get("proxy");
    if (proxy === "false") {
        isProxied = false;
        let frame = document.getElementById("uv-frame");
        frame.src = url;
        document.getElementById("nav-bar-address").value = "";
        document.getElementById("https-lock").innerText = "pending";
        return;
    }

    if (url) {
        let frame = document.getElementById("uv-frame");
        frame.src = __uv$config.prefix + encodeURIComponent(url);
        document.getElementById("nav-bar-address").value = "";
        document.getElementById("https-lock").innerText = "pending";
        return;
    }

    url = document.getElementById("uv-start-page").value;
    let frame = document.getElementById("uv-frame");
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    document.getElementById("nav-bar-address").value = "";
    document.getElementById("https-lock").innerText = "pending";
}

startProxy();