console.log("## chat: entering");

var roomList;
var roomSelect;
var chatRoom;
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
	var container = $('<label/>');
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

	function startWatching(roomEl) {
		var roomElem = $(roomEl);
		var room = createRoom(roomElem);
		var roomOption = createRoomOption(room);
		roomSelect.append(roomOption);
		roomElem.bind("DOMSubtreeModified", function(event) {
			if (room.active !== roomElem.hasClass("active")) {
				activateRoom(room, !room.active);
			}
		});
		var roomMessages = chatContent.find("div#" + room.id + " .chat");
		roomMessages.height(chatContent.height() - 43);
		watchedRooms[room.id] = {
			room: room,
			elem: roomElem,
			option: roomOption
		};
	}

	function stopWatching(roomElem) {
		var roomEntry = watchedRooms[roomElem.attr("data-room-id")];
		roomEntry.elem.off("DOMSubtreeModified");
		roomEntry.option.remove();
		delete watchedRooms[room.id];
	}

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

function leaveRoom(select) {
	var closeButton = chatContent.find("div.tab-pane.active > div.tab-pane-menu > a.close");
	closeButton[0].click();
	select.find('option[value="leave"]').removeAttr("selected");
	select.find('option[value="message"]').attr("selected", "selected");
}

function createActionsSelect() {
	var wrapper = $('<div/>');
	var container = $('<label/>');
	var select = $('<select/>');
	select.append('<option value="messages">Messages</option>');
	select.append('<option value="people">People</option>');
	select.append('<option value="leave">Leave Room</option>');
	select.change(function(ev) {
		switch(ev.target.value) {
			case "messages":
				break;
			case "people":
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
	menus.insertBefore(chatContent);
}

function layoutChatContent() {
	var messages = chatContent.find(".chat");
	if (messages && messages.length) {
		messages.height(chatContent.height() - 43);
	}
}

function initChat() {
	roomList = $("#bbchat-tab-list");
	chatRoom = $("#bbchat-tabs");
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
	layoutChatContent();
});
