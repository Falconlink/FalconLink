const API = {
  "id": EXTENSION_ID,

  "MessageChannel": class MessageChannel {
    constructor(messageID) {
      this.ext_id = API.id;
      this.id = messageID;

      this.listenForMessages();
    }

    listenForMessages() {
      window.addEventListener("message", (event) => {
        try {
          if (event.data.messageID === this.id && event.data.action === "message_main_script") {
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
        "action": "message_content_script",
        "value": value
      }, "*");
    }

    onMessage(message) {
      return;
    }
  },

  "onIconClicked": () => {
    return;
  },

  "onMessageChannelCreate": (channel) => {
    return;
  },

  "listenForMessages": () => {
    window.addEventListener("message", (event) => {
      const messageData = event.data;
      switch (messageData.action) {
        case ("create_channel"):
          API.onMessageChannelCreate(new API.MessageChannel(messageData.messageID));
          break;
        case ("icon_clicked"):
          API.onIconClicked();
          break;
      }
    });
  },

  "showPopup": () => {
      console.log("showing popup");
      window.parent.postMessage({
        "ext_id": API.id,
        "action": "show_popup"
      }, "*");
  },

  "hidePopup": () => {
      window.parent.postMessage({
        "ext_id": API.id,
        "action": "hide_popup"
      }, "*");
  }
}

function register_api_functions() {
  for (let i = 0; i < API_FUNCTIONS.length; i++) {
    API[API_FUNCTIONS[i]] = function () {
      return new Promise((resolve, reject) => {
        const messageId = Date.now();
        const timeout = setTimeout(() => {
          resolve(undefined);
        }, 2000);

        function handleMessage(event) {

          if (event.data.messageID === messageId && event.data.action === "function_response") {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeout);
            resolve(event.data.value);
          }
        }

        window.parent.postMessage({
          "messageID": messageId,
          "action": "function",
          "function": API_FUNCTIONS[i],
          "args": [...arguments],
          "extID": API.id
        }, "*");

        window.addEventListener('message', handleMessage);
      });
    }
  }
}

API.listenForMessages();
register_api_functions();