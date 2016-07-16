
/*
var PADDING = 18;
var TABBED_PANEL_WIDTH = 330;
var TAB_HEIGHT = 30;
*/

/*
$("#cbs-show-page").attr("style", "margin: 0 auto;");
$("#substickyheader").remove();
$("#bbl-promo").remove();
$("#cbs-footer").remove();
$("#bbl").attr("style", "width: 100%;");
$("#bblf-stream .cbs-show-mod-featured").attr("style", "margin: 0;");
$("#masterPageWrapper").attr("style", "background: none; min-height: 0;");
$("#bbl-calendar-button").attr("style", "display: none;");
*/

/*
var container = $("#bbl-container");
var tabbedPanel = $("#bbl-tabs");
var tabs = $("#bbl-tabs .bbl-tab");
var cameras = $("#bbl-camera-list");
var cameraAngles = $("#bbl-camera-angles");
var playerWrapper = $("#cbsi-player-embed");

var screenWidth = $(window).width();
var screenHeight = $(window).height();
var playerAspectRatio = playerWrapper.height() / playerWrapper.width();
*/

/*
function initializeChatContent(chatContent) {
    chatContent.attr("style", "flex-grow: 1; display: flex; flex-direction: column;");
    var chatTabPane;
    chatContent.bind("DOMNodeInserted", function() {
    	if (chatTabPane && chatTabPane.length) {
    		return;
    	}
		chatTabPane = chatContent.find(".tab-pane");
		if (chatTabPane.length) {
			chatTabPane.attr("style", "flex-grow: 1; display: flex; flex-direction: column;");
			chatTabPane.find(".tab-pane-menu").remove(); // TODO: recreate as chat actions below message input
			var chatMessagePanel = chatTabPane.find(".chat");
			chatMessagePanel.parent().attr("style", "flex-grow: 1; display: flex; flex-direction: column;");
    		chatMessagePanel.attr("style", "flex-grow: 1;");
		}
	});
}

function initializeChatFrame(chatFrame) {
	chatFrame.attr("height", "100%");
	var chatFrameHtml = chatFrame.contents().find("html");
	chatFrameHtml.attr("style", "height: 100%");
	var chatFrameBody = chatFrameHtml.find("body");
	chatFrameBody.attr("style", "height: 100%");
	var wrapper = chatFrameBody.find("#wrapper");
    wrapper.attr("style", "display: flex; flex-direction: column; height: 100%;  width: 100%; PADDING: 0;");
	var chat = wrapper.find("#bbchat");
    chat.attr("style", "flex-grow: 1; display: flex; flex-direction: column;");
    
    var chatHeader = chat.find("#bbchat-header");
    chatHeader.attr("style", "height: 20px;");
    var dropdownWrapper = chatHeader.children("div");
    dropdownWrapper.attr("style", "display: flex; flex-direction: row; justify-content: flex-end;");
    var dropdowns = chatHeader.find(".dropdown");
    dropdowns.attr("style", "width: 20px;");
    var dropdownToggles = dropdowns.find(".dropdown-toggle");
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
    var toggleIcons = dropdownToggles.find(".icon");
    toggleIcons.attr("style", "-webkit-filter: invert(1); filter: invert(1);");

    var chatTabbedPanel = chat.find("#bbchat-tabs");
    chatTabbedPanel.attr("style", "flex-grow: 1; display: flex; flex-direction: column; height: 100%; margin-top: 0;");
    var chatContent = chatTabbedPanel.find("#bbchat-tab-content");
    initializeChatContent(chatContent);
}

function initializeChat() {
	var frameWrapper = tabs.find("#bbl-chat-wrapper");
	frameWrapper.attr("style", "PADDING-top: 0;");
	var chatFrame = frameWrapper.children("iframe");
    chatFrame.on('load', function() {
    	initializeChatFrame(chatFrame);
    });
}
*/

/*
function initializeTweetFrame(tweetFrame) {
	tweetFrame.attr("height", "100%");
	var tweetFrameHtml = tweetFrame.contents().find("html");
	tweetFrameHtml.attr("style", "height: 100%");
	var tweetFrameBody = tweetFrameHtml.find("body");
	tweetFrameBody.attr("style", "height: 100%");
	var timelineHeader;
	tweetFrameBody.bind("DOMNodeInserted", function() {
		if (timelineHeader && timelineHeader.length) {
			return;
		}
		timelineHeader = tweetFrameBody.find(".timeline-Header");
		if (timelineHeader.length) {
			timelineHeader.remove();
		}
	});
}

function initializeTweets() {
	var tweetFrame;
	var frameWrapper = tabs.find("#twitter-widget-wrapper");
	frameWrapper.bind("DOMNodeInserted", function() {
		if (tweetFrame && tweetFrame.length) {
			return;
		}
		tweetFrame = frameWrapper.find("iframe");
		if (tweetFrame.length) {
			if (tweetFrame[0].contentWindow && (tweetFrame[0].contentWindow.document.readyState &&
				                                tweetFrame[0].contentWindow.document.readyState !== "loading")) {
				initializeTweetFrame(tweetFrame);
			}
			else {
			    tweetFrame.on('load', function() {
					initializeTweetFrame(tweetFrame);
			    });
			}
		}
	});
}
*/

function initializeCasting() {
	console.log("## initializeCasting", chrome.cast); // TESTING

	var initializeCastApi = function() {
		console.log("## initializeCastApi", chrome.cast); // TESTING
  		var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
  		var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  		chrome.cast.initialize(apiConfig, onInitSuccess, onError);
	};

	/*
	window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
		console.log("## initializeCasting callback"); // TESTING
		if (loaded) {
	    	initializeCastApi();
			console.log("INFO - Casting initialized");
	  	}
	  	else {
			console.log("ERROR - Could not initialize casting: " + errorInfo);
	  	}
	}
	*/
	if (!chrome.cast || !chrome.cast.isAvailable) {
		console.log("## casting available - initializing"); // TESTING
		setTimeout(initializeCastApi, 1000);
	}
}

/*
function initializeTabbedPanel() {
	tabbedPanel.width(TABBED_PANEL_WIDTH);
	tabbedPanel.attr("style", "top: " + PADDING + "px; bottom: " + PADDING + "px; right: " + PADDING + "px;");
	tabbedPanel.addClass("mbd-flex-tabs");
	tabs.attr("style", "");
	initializeChat();
	initializeTweets();
}
*/

/*
var player;
*/
/*
function updatePlayer(width, height) {
	player.attr("style", "visibility: visible; height: " + height + "px;");
	player.find("param[name=width]").attr('value', width);
	player.find("param[name=height]").attr('value', height);
}

function updateCameras(areaHeight, areaWidth, playerHeight) {
	var camerasHeight = areaHeight - playerHeight - PADDING;
	cameras.attr("style", "top: " + PADDING + "px; width: " + areaWidth + "px; height: " + camerasHeight + "px;");
}

function updatePlayArea() {
	
	var areaWidth = screenWidth - tabbedPanel.width() - (3 * PADDING);
	var areaHeight = screenHeight - (2 * PADDING);
	
	var playerWidth = areaWidth;
	var playerHeight = areaWidth * playerAspectRatio;
	var maxPlayerHeight = screenHeight - TAB_HEIGHT - (3 * PADDING);
	if (playerHeight > maxPlayerHeight) {
		playerHeight = maxPlayerHeight;
		playerWidth = playerHeight / playerAspectRatio;
	}
	var playerTop = areaHeight + PADDING - playerHeight;
	var playerLeft = PADDING + Math.round((areaWidth - playerWidth) / 2);

	playerWrapper.attr("style", "width: " + playerWidth + "px; height: " + playerHeight + "px; " +
		                        "top: " + playerTop + "px; left: " + playerLeft + "px;");

	updateCameras(areaHeight, areaWidth, playerHeight);

	if (player) {
		updatePlayer(playerWidth, playerHeight);
	}
	else {
		playerWrapper.bind("DOMNodeInserted", function() {
			if (player && player.length) {
				return;
			}
			player = playerWrapper.find("object");
			if (player.length) {
				updatePlayer(playerWidth, playerHeight);
			}
		});
	}
}
*/

/*
$(window).resize(function() {
	screenWidth = $(window).width();
	screenHeight = $(window).height();
	container.attr("style", "height: " + screenHeight + "px;");
	updatePlayArea();
});
*/

initializeCasting();
/*
container.attr("style", "height: " + screenHeight + "px;");
initializeTabbedPanel();
updatePlayArea();
*/
