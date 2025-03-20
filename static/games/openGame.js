"use strict";

function showProxy() {
  let div = document.getElementById("proxy-div");
  div.classList = ["show-proxy-div"];
}

function hideProxy() {
  let div = document.getElementById("proxy-div");
  div.classList = ["hide-proxy-div"];
}


async function openGame(url) {
  showProxy();

  let frame = document.getElementById("uv-frame");
  frame.src = "/tab?page=" + __uv$config.encodeUrl(url);
}

window.onmessage = (e) => {
  if (e.data == "goHome") {
    let frame = document.getElementById("uv-frame");
    frame.src = "about:blank";
    hideProxy();
  }
}