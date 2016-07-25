console.log("## chat: entering");

var tabContent;
var chats;

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

function initChatContent() {
	tabContent = $("#bbchat-tab-content");
	chats = tabContent.find(".chat");
	layoutChatContent();
	tabContent.bind("DOMNodeInserted", function() {
		chats = tabContent.find(".chat");
		layoutChatContent();
	});
}

function layoutChatContent() {
	if (chats && chats.length) {
		chats.height(tabContent.height() - 43);
	}
}

$(document).ready(function() {
    console.log("## chat: document ready");
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("## chat: dom available", event);
});

window.onload = function() {
	console.log("## chat: window loaded");
	initDropdownToggles();
	initChatContent();
};

$(window).resize(function() {
	layoutChatContent();
});
