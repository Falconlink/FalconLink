const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const url = search(address.value, searchEngine.value);
    address.value = "";

    window.parent.isProxied = true;
    location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
  });