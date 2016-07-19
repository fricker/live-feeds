console.log("## content: entering");

var PADDING = 18;
var MIN_CAMERAS_HEIGHT = 98;
var MIN_TABBED_PANEL_WIDTH = 330;

// Screen

var screenWidth;
var screenHeight;
var container;

function initScreen() {
	container = $("#bbl-container");
	initTabbedPanel();
	initCameras();
	initPlayer();
}

function layoutScreen() {
	screenWidth = $(window).width();
	screenHeight = $(window).height();
	container.attr("style", "height: " + screenHeight + "px;");
}

// Player

var playerWrapper;
var player;
var playerAspectRatio;

function initPlayer() {
	playerWrapper = $("#cbsi-player-embed");
	playerAspectRatio = playerWrapper.height() / playerWrapper.width();
	player = playerWrapper.find("object");
}

function updatePlayer(width, height) {
	player.attr("style", "visibility: visible; width: " + width + "px; height: " + height + "px;");
	player.find("param[name=width]").attr('value', width);
	player.find("param[name=height]").attr('value', height);
}

// Cameras

var cameraList;
var cameraAngles;
var allCameraLinks;
var cameras;
var cameraImages;
var firstCamera;
var camerasBackground;
var camerasVideo;
var quadCamera;
var quadCameraImage;

function initCameras() {
	cameraList = $("#bbl-camera-list");
	cameraAngles = $("#bbl-camera-angles");
	
	var allCameras = cameraAngles.children();
	allCameraLinks = allCameras.find("a");
	
	cameras = $(allCameras.slice(0, 4));
	cameraImages = cameras.find(".liveimg");
	
	firstCamera = $(allCameras[0]);
	camerasBackground = firstCamera.children("#strip-bg");
	camerasVideo = firstCamera.children("object");
	
	quadCamera = $(allCameras[4]);
	quadCameraImage = quadCamera.find(".liveimg");
}

function getCameraSizes(areaHeight, maxPlayerWidth) {
	var initialPlayerHeight = Math.floor(maxPlayerWidth * playerAspectRatio);
	var cameraHeight = areaHeight - initialPlayerHeight - PADDING;
	if (cameraHeight < MIN_CAMERAS_HEIGHT) {
		cameraHeight = MIN_CAMERAS_HEIGHT;
	}
	var camVideoHeight = cameraHeight - 30;
	var camVideoWidth = Math.floor(camVideoHeight * 480 / 68);
	var quadWidth = Math.floor(camVideoHeight * 116 / 68);
	var camAnglesWidth = camVideoWidth + quadWidth;
	if (camAnglesWidth > maxPlayerWidth) {
		camVideoHeight = Math.floor(camVideoHeight * maxPlayerWidth / camAnglesWidth);
		camVideoWidth = Math.floor(camVideoHeight * 480 / 68);
		quadWidth = Math.floor(camVideoHeight * 116 / 68);
		camAnglesWidth = maxPlayerWidth;
	}
	var cameraWidth = Math.floor(camVideoWidth / 4);
	cameraHeight = camVideoHeight + 30;

	return {
		camVideoHeight: camVideoHeight,
		camVideoWidth: camVideoWidth,
		camAnglesWidth: camAnglesWidth,
		cameraWidth: cameraWidth,
		cameraHeight: cameraHeight,
		quadWidth: quadWidth
	};
}

function updateCamerasVideo(width, height) {
	camerasVideo.attr("style", "visibility: visible; width: " + width + "px; height: " + height + "px;");
	camerasVideo.find("param[name=width]").attr('value', width);
	camerasVideo.find("param[name=height]").attr('value', height);
}

function updateCameraList(cameraSizes) {
	cameraList.attr("style", "width: " + cameraSizes.cameraListWidth + "px; height: " + cameraSizes.cameraHeight + "px;");
	cameraAngles.attr("style", "display: block; width: " + cameraSizes.camAnglesWidth + "px; " +
		                       "height: " +cameraSizes.cameraHeight + "px;");
	cameras.attr("style", "width: " + cameraSizes.cameraWidth + "px; height: " + cameraSizes.cameraHeight + "px;");
	cameraImages.attr("style", "height: " + cameraSizes.camVideoHeight + "px;");
	quadCamera.attr("style", "width: " + cameraSizes.quadWidth + "px; height: " + cameraSizes.cameraHeight + "px;");
	quadCameraImage.attr("style", "width: " + cameraSizes.quadWidth + "px; height: " + cameraSizes.camVideoHeight + "px;");
	allCameraLinks.attr("style", "height: " + cameraSizes.cameraHeight + "px;");
	camerasBackground.attr("style", "width: " + cameraSizes.camVideoWidth + "px; height: " + cameraSizes.camVideoHeight + "px;");

	if (camerasVideo.length) {
		updateCamerasVideo(cameraSizes.camVideoWidth, cameraSizes.camVideoHeight);
	}
	else {
		firstCamera.bind("DOMNodeInserted", function() {
			if (!camerasVideo.length) {
				camerasVideo = firstCamera.children("object");
				if (camerasVideo.length) {
					updateCamerasVideo(cameraSizes.camVideoWidth, cameraSizes.camVideoHeight);
				}
			}
		});
	}
}

// Play Area

function updatePlayArea() {
	var areaHeight = screenHeight - (PADDING * 2);
	var maxPlayerWidth = screenWidth - MIN_TABBED_PANEL_WIDTH - (PADDING * 3);
	var cameraSizes = getCameraSizes(areaHeight, maxPlayerWidth);
	var playerHeight = areaHeight - cameraSizes.cameraHeight - PADDING;
	var playerWidth = Math.floor(playerHeight / playerAspectRatio);
	if (playerWidth > maxPlayerWidth) {
		playerWidth = maxPlayerWidth;
		playerHeight = Math.floor(playerWidth * playerAspectRatio);
	}
	cameraSizes.cameraListWidth = playerWidth;
	updateCameraList(cameraSizes);
	var playerTop = cameraSizes.cameraHeight + (PADDING * 2);
	playerWrapper.attr("style", "top: " + playerTop + "px; width: " + playerWidth + "px; height: " + playerHeight + "px; ");
	if (player.length) {
		updatePlayer(playerWidth, playerHeight);
	}
	else {
		playerWrapper.bind("DOMNodeInserted", function() {
			if (!player.length) {
				player = playerWrapper.find("object");
				if (player.length) {
					updatePlayer(playerWidth, playerHeight);
				}
			}
		});
	}
	return {
		width: playerWidth,
		height: playerHeight
	};
}

// Chat Room

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
	var chatFrame = tabs.find("#bbl-chat-wrapper").children("iframe");
    chatFrame.on('load', function() {
    	initializeChatFrame(chatFrame);
    });
}

// Twitter Feed

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

// Tabbed Panel

var tabbedPanel;
var tabs;

function initTabbedPanel() {
	tabbedPanel = $("#bbl-tabs");
	tabs = $("#bbl-tabs .bbl-tab");
	initializeChat();
	initializeTweets();
}

function updateTabbedPanel(playerSize) {
	tabbedPanel.width(screenWidth - playerSize.width - (3 * PADDING));
}

// Document

$(document).ready(function() {
    console.log("## content: document ready");
	initScreen();
	layoutScreen();
	var playerSize = updatePlayArea();
	updateTabbedPanel(playerSize);
	$("#cbs-page").addClass("content-ready");
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("## content: dom available", event);
});

window.onload = function() {
	console.log("## content: window loaded");
};

$(window).resize(function() {
	layoutScreen();
	var playerSize = updatePlayArea();
	updateTabbedPanel(playerSize);
});
