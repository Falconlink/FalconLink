class Extension {
    constructor(id) {
        this.loadManifest(id)
    }

    async loadManifest(id) {
        const response = await fetch("/extensions/" + id + "/manifest.json");
        if (!response.ok) {
            throw new Error(`Tried to fetch extension manifest. Response status: ${response.status}`);
        }

        this.channels = {};
        const json = await response.json();
        this.ext = json;

        this.iframe = document.createElement("iframe");

        if (this.ext.popup) {
            this.iframe.src = this.api.getSrcFor(this.ext, this.ext.popup);
            this.iframe.onload = (event) => {
                event.target.contentDocument.body.appendChild(document.createElement("script")).innerHTML = `const EXTENSION_ID = ${this.ext.id}; const API_FUNCTIONS = ${JSON.stringify(Object.keys(this.api))}`;
                event.target.contentDocument.body.appendChild(document.createElement("script")).src = "/extensionlib/api.js";
                event.target.contentDocument.body.appendChild(document.createElement("script")).src = location.origin + "/extensions/" + this.ext.id + (this.ext.script[0] == "/" ? "" : "/") + this.ext.script;
            }
        } else {
            this.iframe.srcdoc = `<!DOCTYPE HTML><html><head><script>const EXTENSION_ID = ${this.ext.id}; const API_FUNCTIONS = ${JSON.stringify(Object.keys(this.api))}</script><script src="/extensionlib/api.js"></script></head><body><script src="${location.origin}/extensions/${this.ext.id + (this.ext.script[0] == "/" ? "" : "/") + this.ext.script}"/></script></body></html>`;
        }
        this.iframe.classList.add("extension-iframe");
        this.iframe.classList.add("hide");
        this.iframe.classList.add("w3-card");
        
        document.getElementById("extensions-container").append(this.iframe);

        setInterval(this.resizePopup, 1000);
        this.iframe.contentWindow.addEventListener("resize", this.resizePopup);
        window.addEventListener("resize", this.resizePopup);
        this.listenForAPICalls();
        this.showExtPopup();
    }

    resizePopup() { 
        if (this.iframe.classList.contains("hide")) return;
        this.iframe.style.width = this.iframe.contentDocument.body.scrollWidth + "px";
        this.iframe.style.height = this.iframe.contentDocument.body.scrollHeight + "px";
    }

    sendFunctionResponse(action, value, id = Date.now()) {
        this.iframe.contentWindow.postMessage({
            "messageID": id,
            "action": action,
            "value": value
        }, "*");
    }

    showExtPopup() {
        console.log(this);
        this.iframe.classList.remove("hide");
        this.iframe.classList.add("show");
    }

    hideExtPopup() {
        this.iframe.classList.add("hide");
        this.iframe.classList.remove("show");
    }

    listenForAPICalls() {
        addEventListener("message", (event) => {
            if (event.data.extID === this.ext.id) {
                const messageData = event.data;
                switch (messageData.action) {
                    case ("function"):
                        try {
                            this.sendFunctionResponse("function_response", this.api[messageData.function](this.ext, ...messageData.args), messageData.messageID);
                        }
                        catch (err) {
                            this.sendFunctionResponse("function_response", "Error: " + err.message, messageData.messageID);
                        }
                        break;
                    case ("create_channel"):
                        this.iframe.contentWindow.postMessage({
                            "action": "create_channel",
                            "messageID": messageData.messageID
                        }, "*");
                        this.channels[messageData.messageID] = event.source;
                        break;
                    case ("message_content_script"):
                        this.channels[messageData.messageID].postMessage({
                            "messageID": messageData.messageID,
                            "extID": this.ext.id,
                            "action": "message_content_script",
                            "value": messageData.value
                        }, "*")
                        break;
                    case ("message_main_script"):
                        this.iframe.contentWindow.postMessage({
                            "messageID": messageData.messageID,
                            "extID": this.ext.id,
                            "action": "message_main_script",
                            "value": messageData.value
                        }, "*")
                        break;
                    case ("show_popup"):
                        this.showExtPopup();
                        break; 
                    case ("hide_popup"):    
                        this.hideExtPopup();
                        break;
                }
            }
        });
    }

    iconClicked() {
        this.iframe.contentWindow.postMessage({
            "action": "icon_clicked"
        }, "*")
    }

    api = {
        getSrcFor: function (ext, path) {
            path = (path[0] == "/" ? "" : "/") + path; //add "/" to beggining of path if it isnt there
            return window.location.origin + "/extensions/" + ext.id + path;
        },

        getCurrentTab: function (ext) {
            var url = document.getElementById("frame" + currentTab).contentWindow.getTabURL();
            var frame = document.getElementById("frame" + currentTab).contentDocument.getElementById("uv-frame");
            var title = frame.contentDocument.title;

            return ({
                "url": url,
                "id": currentTab,
                "title": title
            })
        },

        getAllTabs: function (ext) {
            var tabs = [];
            for (var i = 0; i < tabIds.length; i++) {
                var url = document.getElementById("frame" + currentTab).contentWindow.getTabURL();
                var frame = document.getElementById("frame" + tabIds[i]).contentDocument.getElementById("uv-frame");
                var title = frame.contentDocument.title;

                tabs.push({
                    "url": url,
                    "id": tabIds[i],
                    "title": title
                })
            }
            return tabs;
        },

        getTabByID: function (ext, id) {
            var url = document.getElementById("frame" + currentTab).contentWindow.getTabURL();
            var frame = document.getElementById("frame" + id).contentDocument.getElementById("uv-frame");
            var title = frame.contentDocument.title;

            return ({
                "url": url,
                "id": id,
                "title": title
            })
        },

        createTab: function (ext, url, proxy = true) {
            if (proxy) {
                newTab("/tab?page=" + __uv$config.encodeUrl(url));
            } else {
                newTab("/tab?proxy=false&page=" + url);
            }
            return currentTab;
        },

        injectScript: function (ext, script, tabID, inline = false) {
            var frame = document.getElementById("frame" + tabID).contentDocument.getElementById("uv-frame");
            var scriptEl = frame.contentDocument.querySelector('script[src="' + location.origin + '/extensionlib/content_script.js"]');
            if (!scriptEl) {
                var scriptEl = document.createElement("script");
                scriptEl.src = location.origin + '/extensionlib/content_script.js'
                frame.contentDocument.body.appendChild(scriptEl);
            }

            try {
                var scriptEl = document.createElement("script");
                if (inline) {
                    scriptEl.innerHTML = script;
                    scriptEl.classList.add("extension-" + ext.id + "-script");
                } else {
                    scriptEl.src = script;
                }
                scriptEl.setAttribute("ext_id", ext.id);
                frame.contentDocument.body.appendChild(scriptEl);

                return true;
            } catch (err) {
                //throw(err);
                return "Error: " + err.message;
            }
        },

        isScriptInjected(ext, script, tabID, inline = false) {
            var frame = document.getElementById("frame" + tabID).contentDocument.getElementById("uv-frame");
            if (inline) {
                const scripts = frame.contentDocument.querySelectorAll('script[class="extension-' + ext.id + '-script"]');
                scripts.forEach((scriptEl) => {
                    if (scriptEl.innerHTML == script) {
                        return true;
                    }
                });
            } else {
                const scriptEl = frame.contentDocument.querySelector('script[src="' + script + '"]');
                if (scriptEl) return true;
            }
            return false;
        },

        getWindowById(ext, tabID) {
            return document.getElementById("frame" + tabID).contentDocument.getElementById("uv-frame").contentWindow;
        }
    }
}