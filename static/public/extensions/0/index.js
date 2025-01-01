async function injectAdBlocker() {
    const script = await API.getSrcFor("coolscript.js");
    const tabs = await API.getAllTabs();
    for (var i = 0; i < await tabs.length; i++) {
        if (!(await API.isScriptInjected(await script, await tabs[i].id))) {
            API.injectScript(await script, await tabs[i].id);
        }
    }
}

setInterval(injectAdBlocker, 1000);

API.showPopup();