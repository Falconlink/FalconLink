class ExtensionMessageChannel {
    constructor(ext_id = Number(document.currentScript.getAttribute("ext_id"))) {
        this.ext_id = ext_id;
        this.id = Date.now();
        window.parent.parent.postMessage({
            "messageID": this.id,
            "extID": this.ext_id,
            "action": "create_channel"
        }, "*");

        this.listenForMessages();
    }

    listenForMessages() {
        window.addEventListener("message", (event) => {
            try {
                if (event.data.extID === this.ext_id && event.data.messageID === this.data.messageID && this.data.action === "message_content_script") {
                    this.onMessage(event.data.value);
                }
            } catch (err) {
                return;
            }
        })
    }

    sendMessage(value) {
        window.parent.parent.postMessage({
            "messageID": this.id,
            "extID": this.ext_id,
            "action": "message_main_script",
            "value": value
        }, "*");
    }

    onMessage(message) {
        return;
    }
}