console.log("## chat: entering");

jQuery.fn.extend({
	insertAtCaret: function(myValue) {
	  return this.each(function(i) {
	    if (document.selection) {
	      //For browsers like Internet Explorer
	      this.focus();
	      var sel = document.selection.createRange();
	      sel.text = myValue;
	      this.focus();
	    }
	    else if (this.selectionStart || this.selectionStart == '0') {
	      // For browsers like Firefox and Webkit based
	      var startPos = this.selectionStart;
	      var endPos = this.selectionEnd;
	      var scrollTop = this.scrollTop;
	      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	      this.focus();
	      this.selectionStart = startPos + myValue.length;
	      this.selectionEnd = startPos + myValue.length;
	      this.scrollTop = scrollTop;
	    }
	    else {
	      this.value += myValue;
	      this.focus();
	    }
	  });
	}
});

var chatHeader;
var roomSelect;
var chatContent;
var watchedRooms = {};

function initDropdownToggles() {
    var dropdownToggles = $("#bbchat-header .dropdown-toggle");
    dropdownToggles.removeClass("btn");
    dropdownToggles.each(function(index, toggle) {
    	var toggleElem = $(toggle);
    	var title = toggleElem.text().trim();
    	if (!title.length) {
    		title = "You";
    	}
    	toggleElem.attr("title", title);
    });
    dropdownToggles.contents().filter(function() {
		return (this.nodeType == 3 || (this.nodeType == 1 && !$(this).hasClass("icon")));
	}).remove();	
}

function createRoom(roomElem) {
	return {
		id: roomElem.attr("data-room-id"),
		title: roomElem.children()[0].title,
		active: roomElem.hasClass("active")
	}
}

function createRoomsSelect() {
	var wrapper = $('<div/>');
	var container = $('<label class="custom-select"/>');
	roomSelect = $('<select/>');
	roomSelect.change(function(ev) {
		var roomEntry = watchedRooms[ev.target.value];
		roomEntry.elem.children()[0].click();
	});
	container.append(roomSelect);
	wrapper.append(container);
	return wrapper;
}

function createRoomOption(room) {
	var selected = room.selected ? ' selected="selected"' : '';
	return $('<option value="' + room.id + '"' + selected + '>' + room.title + '</option>');
}

function activateRoom(room, active) {
	room.active = active;
	var roomEntry = watchedRooms[room.id];
	if (active) {
		roomEntry.option.attr("selected", "selected");
	}
	else {
		roomEntry.option.removeAttr("selected");
	}
}

function watchRooms() {

	function watchMessages(room) {
		var roomMessages = chatContent.find("div#" + room.id + " .chat");
		roomMessages.height(chatContent.height() - 48);
		roomMessages.bind("DOMNodeInserted", function(event) {
			var messageContentElem = $(event.target).find(".message-content");
			if (messageContentElem.hasClass("content-processed")) {
				return;
			}
			var messageContent = messageContentElem.text();
			var updatedContent = messageContent.replace(/#(\S+)/g, '<a class="message-tag" href="#">#$1</a>');
			if (updatedContent !== messageContent) {
				messageContentElem.html(updatedContent);
				messageContentElem.find(".message-tag").click(function(event) {
					extensionConnection.postMessage({type: "messageTagClicked", info: $(event.target).text()});
				});
			}
			messageContentElem.addClass("content-processed");
		});
		return roomMessages;
	}

	function startWatching(roomEl) {
		var activated = false;
		var roomElem = $(roomEl);
		var room = createRoom(roomElem);
		var roomOption = createRoomOption(room);
		roomSelect.append(roomOption);
		roomElem.bind("DOMSubtreeModified", function(event) {
			if (room.active !== roomElem.hasClass("active")) {
				activateRoom(room, !room.active);
				if (!activated) {
					chatHeader.addClass("activated");
					activated = true;
				}
			}
		});
		var watchedMessages = watchMessages(room);
		watchedRooms[room.id] = {
			room: room,
			elem: roomElem,
			option: roomOption,
			messages: watchedMessages
		};
	}

	function stopWatching(roomElem) {
		var roomEntry = watchedRooms[roomElem.attr("data-room-id")];
		roomEntry.messages.off("DOMNodeInserted");
		roomEntry.elem.off("DOMSubtreeModified");
		roomEntry.option.remove();
		delete watchedRooms[roomEntry.room.id];
	}

	var roomList = $("#bbchat-tab-list");
	roomList.children().each(function(index, roomEl) {
		startWatching($(roomEl));
	});
	roomList.bind("DOMNodeInserted", function(event) {
		startWatching($(event.target));
	});
	roomList.bind("DOMNodeRemoved", function(event) {
		stopWatching($(event.target));
	});
}

function displayMessages() {
}

function displayPeople() {
	alert("Under Construction");
}

function sendInvite(select) {
	select.find('option[value="invite"]').removeAttr("selected");
	select.find('option[value="message"]').attr("selected", "selected");
	alert("Under Construction");
}

function leaveRoom(select) {
	var closeButton = chatContent.find("div.tab-pane.active > div.tab-pane-menu > a.close");
	closeButton[0].click();
	select.find('option[value="leave"]').removeAttr("selected");
	select.find('option[value="message"]').attr("selected", "selected");
}

function createActionsSelect() {
	var wrapper = $('<div/>');
	var container = $('<label class="custom-select"/>');
	var select = $('<select/>');
	select.append('<option value="messages">Messages</option>');
	select.append('<option value="people">People</option>');
	select.append('<option value="invite">Send Invite…</option>');
	select.append('<option value="leave">Leave Room…</option>');
	select.change(function(ev) {
		switch(ev.target.value) {
			case "messages":
				displayMessages();
				break;
			case "people":
				displayPeople();
				break;
			case "invite":
				sendInvite(select);
				break;
			case "leave":
				leaveRoom(select);
				break;
		};
	});
	container.append(select);
	wrapper.append(container);
	return wrapper;
}

function initMenus() {
	var menus = $('<div id="bbchat-menus"></div>');
	menus.append(createRoomsSelect());
	menus.append(createActionsSelect());
	$("#bbchat-header").prepend(menus);
}

function layoutChatContent() {
	var messages = chatContent.find(".chat");
	if (messages && messages.length) {
		messages.height(chatContent.height() - 48);
	}
}

function initChat() {
	chatHeader = $("#bbchat-header");
	chatContent = $("#bbchat-tab-content");
	initDropdownToggles();
	initMenus();
	layoutChatContent();
	watchRooms();
}

$(document).ready(function() {
    console.log("## chat: document ready");
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("## chat: dom available", event);
});

window.onload = function() {
	console.log("## chat: window loaded");
	initChat();
};

$(window).resize(function() {
	if (chatContent) {
		layoutChatContent();
	}
});

function sendChromeMessage(messageType, messageInfo, callback) {
	var request = {type: messageType, info: messageInfo};
  	chrome.runtime.sendMessage(request, function(response) {
 		if (chrome.runtime.lastError) {
        	console.log("## chat: message request failed", chrome.runtime.lastError);
        	return;
     	}
     	if (callback) {
     		callback(response);
     	}
	});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("## chat: chrome.runtime.onMessage", request, sender);
	if (request.type === "pasteFlashback") {
		$(document.activeElement).insertAtCaret("#FB_" + request.info);
		sendResponse({message: "ok"});
	}
});

var extensionConnection = chrome.runtime.connect({name: "chat-connection"});
extensionConnection.onMessage.addListener(function(msg) {
   console.log("chat: extension.msg=" + msg);
});
