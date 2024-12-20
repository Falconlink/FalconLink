const API = {
    
}

for (var i = 0; i < API_FUNCTIONS.length; i++) {
    API[API_FUNCTIONS[i]] = function(args) {
        return new Promise((resolve, reject) => {
            const messageId = Date.now();
        
            function handleMessage(event) {
        
              if (event.data.messageID === messageId) {
                window.removeEventListener('message', handleMessage);
                resolve(event.data.value);
              }
            }
        
            window.addEventListener('message', handleMessage);
        
            window.postMessage({
                "messageID": messageId,
                "type": "function",
                "value": API_FUNCTIONS[i],
                "args": args
            }, "*");
          });
    }
}