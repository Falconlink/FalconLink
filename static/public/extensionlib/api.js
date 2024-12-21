const API = {
  "id": EXTENSION_ID
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

register_api_functions();