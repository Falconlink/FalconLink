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
        iframe.srcdoc = `<!DOCTYPE HTML><html><head><script>const EXTENSION_ID = ${this.ext.id}; const API_FUNCTIONS = ${ JSON.stringify(Object.keys(this.api)) }</script><script defer src="/extensionlib/api.js"></script></head><body><script src="${location.origin}/extensions/${this.ext.id + (this.ext.script[0] == "/" ? "" : "/") + this.ext.script}"/></script></body></html>`;
        iframe.style.display = "none";
        document.body.append(iframe);
    }

    sendMessage(type, value, id = Date.now()) {
        window.postMessage({
            "messageID": id,
            "type": type,
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
                            this.sendMessage("function_response", this.api[messageData.function](...messageData.args), messageData.messageID);
                        }
                        catch (err) {
                            this.sendMessage("function_response", "Error: " + err.message + messageData.messageID);
                        }
                }
            }
        })
    }

    api = {
        getSrcFor: function (path) {
            path += path[0] == "/" ? "" : "/"; //add "/" to beggining of path if it isnt there
            return window.location.origin + "/extensions/" + this.ext.id + path;
        },

        getCurrentTab: function () {
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

        getAllTabs: function () {
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

        getTabByID: function (id) {
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

        createTab: function (url, proxy=true) {
            if(proxy) {
                newTab(location.origin + "/uv/service/" + __$uvconfig.encodeUrl(url));
            } else {
                newTab(url);
            }
            return currentTab;
        },

        injectScript: function(script, tabID, inline=false) {
            try {
                var frame = document.getElementById("frame" + tabID).contentDocument.getElementById("uv-frame");
                var script = document.createElement("script");
                if (inline) {
                    script.innerHTML = script;
                } else {
                    script.src = script
                }
                frame.contentDocument.body.appendElement(script);

                return true;
            } catch (err) {
                return false;
            }
        }
    }
}