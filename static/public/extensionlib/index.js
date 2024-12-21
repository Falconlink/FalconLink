class Extension {
    constructor(id) {
        this.loadManifest(id)
    }

    async loadManifest(id) {
        const response = await fetch("/extensions/" + id + "/manifest.json");
        if (!response.ok) {
            throw new Error(`Tried to fetch extension manifest. Response status: ${response.status}`);
        }

        const json = await response.json();
        this.ext = json;

        const iframe = document.createElement("iframe");
        iframe.srcdoc = `<!DOCTYPE HTML><html><head><script>const EXTENSION_ID = ${this.ext.id}; const API_FUNCTIONS = ${ JSON.stringify(Object.keys(this.api)) }</script><script src="/extensionlib/api.js"></script></head><body><script src="${location.origin}/extensions/${this.ext.id + (this.ext.script[0] == "/" ? "" : "/") + this.ext.script}"/></script></body></html>`;
        iframe.style.display = "none";
        this.iframe = iframe;
        document.body.append(iframe);

        this.listenForAPICalls();
    }

    sendMessage(action, value, id = Date.now()) {
        this.iframe.contentWindow.postMessage({
            "messageID": id,
            "action": action,
            "value": value
        }, "*");
    }

    listenForAPICalls() {
        addEventListener("message", (event) => {
            if (event.data.extID === this.ext.id) {
                const messageData = event.data;
                switch (messageData.action) {
                    case ("function"):
                        try {
                            this.sendMessage("function_response", this.api[messageData.function](this.ext, ...messageData.args), messageData.messageID);
                        }
                        catch (err) {
                            this.sendMessage("function_response", "Error: " + err.message, messageData.messageID);
                        }
                }
            }
        });
    }

    api = {
        getSrcFor: function (ext, path) {
            path = (path[0] == "/" ? "" : "/") + path; //add "/" to beggining of path if it isnt there
            return window.location.origin + "/extensions/" + ext.id + path;
        },

        getCurrentTab: function (ext) {
            function decodeUrl(str) {
                if (!str) return str;
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
            }

            var frame = document.getElementById("frame" + currentTab).contentDocument.getElementById("uv-frame");
            var title = frame.contentDocument.title;

            return ({
                "url": decodeUrl(document.getElementById("frame" + currentTab).contentDocument.getElementById("uv-frame").contentWindow.location.href),
                "id": currentTab,
                "title": title
            })
        },

        getAllTabs: function (ext) {
            var tabs = [];
            for (var i = 0; i < tabIds.length; i++) {
                function decodeUrl(str) {
                    if (!str) return str;
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
                }

                var frame = document.getElementById("frame" + tabIds[i]).contentDocument.getElementById("uv-frame");
                var title = frame.contentDocument.title;

                tabs.push({
                    "url": decodeUrl(document.getElementById("frame" + tabIds[i]).contentDocument.getElementById("uv-frame").contentWindow.location.href),
                    "id": tabIds[i],
                    "title": title
                })
            }
            return tabs;
        },

        getTabByID: function (ext, id) {
            function decodeUrl(str) {
                if (!str) return str;
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
            }

            var frame = document.getElementById("frame" + id).contentDocument.getElementById("uv-frame");
            var title = frame.contentDocument.title;

            return({
                "url": decodeUrl(document.getElementById("frame" + id).contentDocument.getElementById("uv-frame").contentWindow.location.href),
                "id": id,
                "title": title
            })
        },

        createTab: function (ext, url, proxy=true) {
            if(proxy) {
                newTab(location.origin + "/uv/service/" + __$uvconfig.encodeUrl(url));
            } else {
                newTab(url);
            }
            return currentTab;
        },

        injectScript: function(ext, script, tabID, inline=false) {
            try {
                var frame = document.getElementById("frame" + tabID).contentDocument.getElementById("uv-frame");
                var scriptEl = document.createElement("script");
                if (inline) {
                    scriptEl.innerHTML = script;
                    scriptEl.classList.add("extension-" + ext.id + "-script");
                } else {
                    scriptEl.src = script;
                }
                frame.contentDocument.body.appendChild(scriptEl);

                return true;
            } catch (err) {
                return "Error: " + err.message;
            }
        },

        isScriptInjected(ext, script, tabID, inline=false) {
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
        }
    }
}