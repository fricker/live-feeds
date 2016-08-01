console.log("## background: entering");

var contextMenuItem;

function contextClicked(info, tab) {
   console.log("## background: contextClicked", info, tab);
   sendChromeMessage("getFlashbackCode", info, function(codeResponse) {
      sendChromeMessage("pasteFlashback", codeResponse.info, function(pasteResponse) {
         if (pasteResponse.message === "ok") {
            console.log("## background: flashbackCode pasted", codeResponse.info);
         }            
      });
   });
}

function prepareContext() {
   contextMenuItem = chrome.contextMenus.create({
      "id": "paste_flashback",
      "title": "Paste Flashback",
      "contexts": ["editable"],
      "onclick": contextClicked
   },
   function() {
      if (chrome.runtime.lastError) {
         console.log("## background: Error creating context menu item", chrome.runtime.lastError);
      }
      else {
         console.log("## background: Created context menu item");
      }
   });
}
chrome.runtime.onInstalled.addListener(prepareContext);

function sendChromeMessage(messageType, messageInfo, callback) {
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var request = {type: messageType, info: messageInfo};
         chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
         if (chrome.runtime.lastError) {
               console.log("## background: message request failed", chrome.runtime.lastError);
               return;
            }
            if (callback) {
               callback(response);
            }
      });
   });   
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   console.log("## background: chrome.runtime.onMessage", request, sender);
});

function onContentRequest(connection, request) {
   console.log("background: onContentRequest", request); // TESTING
}

function onChatRequest(connection, request) {
   console.log("background: onChatRequest", request); // TESTING
   if (request.type === "messageTagClicked") {
      sendChromeMessage("flashbackCode", request.info.substring(4));
   }
}

chrome.runtime.onConnect.addListener(function(connection) {
   console.log("background: connection established", connection); // TESTING
   if (connection.name == "content-connection") {
      connection.onMessage.addListener(function(msg) {
         onContentRequest(connection, msg);
      });
      return;
   }
   if (connection.name == "chat-connection") {
      connection.onMessage.addListener(function(msg) {
         onChatRequest(connection, msg);
      });
      return;
   }
});
