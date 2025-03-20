var lazyLoad = new LazyLoad();

var appsJson = [];
var searchedAppsJson = [];
var currentPage = 0;

var appsDiv = document.getElementById("apps-container")

const pageSize = 50;

function getAppHTML(app) {
  return (`
  <div class="app" onclick="openApp('${app["url"]}')">
    <div class="app-image-container">
      <img class="app-image lazy" src="${app["image"]}">
    </div>
    <p class="app-title">
      ${app["name"]}
    </p>
  </div>
  `);
}

function setApps(page) {
  var html = '<div class="app-row">';
  for (var i = page * pageSize; i < searchedAppsJson.length; i++) {
    html += getAppHTML(searchedAppsJson[i]);
    if (((1 + i) - (page * pageSize)) % 5 == 0) html += '</div><div class="app-row">';
    if (i - (page * pageSize) == pageSize - 1) break;
  }
  appsDiv.innerHTML = html + '</div>';
  if(!appsDiv.childNodes[appsDiv.childNodes.length - 1].hasChildNodes()) appsDiv.childNodes[appsDiv.childNodes.length - 1].remove();
  lazyLoad.update();
}

function loadApps() {
  fetch("apps.json").then((res) => res.json()).then((res) => {
    appsJson = res;
    searchedAppsJson = appsJson;
    currentPage = 0;
    setPageArrows();
    setApps(0);
  });
}

function searchApps(e) {
  currentPage = 0;
  setPageArrows();
  apps = []
  for (var i = 0; i < appsJson.length; i++) {
    if (appsJson[i]["name"].toLowerCase().search(e.value.toLowerCase()) != -1) apps.push(appsJson[i]);
  }
  searchedAppsJson = apps;
  setPageArrows();
  setApps(currentPage);
}

function setPageArrows() {
  var maxPage = getPageCount() - 1;
  if (currentPage < 0) currentPage = 0;
  if (currentPage > maxPage) currentPage = maxPage;
  var pageNumbers = document.getElementsByClassName("page-number");
  pageNumbers[0].innerHTML = currentPage + 1;
  pageNumbers[1].innerHTML = currentPage + 1;
  var btns = document.getElementsByClassName("switch-page");
  if (currentPage == 0) { btns[0].style.visibility = "hidden"; btns[2].style.visibility = "hidden" } else { btns[0].style.visibility = "visible"; btns[2].style.visibility = "visible" };
  if (currentPage == maxPage) { btns[1].style.visibility = "hidden"; btns[3].style.visibility = "hidden" } else { btns[1].style.visibility = "visible"; btns[3].style.visibility = "visible" };
}

function getPageCount() {
  return Math.ceil(searchedAppsJson.length / pageSize);
}

function scrollToTopOfApps() {
  document.getElementsByClassName("main-div")[0].scroll({top: 0,left: 0,behavior: "instant"});
}

loadApps();