console.log("## content: entering");

var PADDING = 18;
var MIN_CAMERAS_HEIGHT = 98;
var MIN_TABBED_PANEL_WIDTH = 330;

// Screen

var screenWidth;
var screenHeight;
var container;

function initAlerts() {
	var alertText = $("#bbl-alert-text");
	alertText.bind("DOMNodeInserted", function() {
		var tickerItems = alertText.find(".newsticker li");
		tickerItems.attr("title", "Click To Remove");
		tickerItems.click(function() {
			$("#bbl-alerts").remove();
		});
	});
}

function initScreen() {
	container = $("#bbl-container");
	initAlerts();
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
var quadCamImageWrapper;
var quadCamImage;

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
	quadCamImageWrapper = quadCamera.find("#livecam5");
	quadCamImage = quadCamImageWrapper.children();
}

function getCameraSizes(areaHeight, maxPlayerWidth) {
	var initialPlayerHeight = Math.floor(maxPlayerWidth * playerAspectRatio);
	var cameraHeight = areaHeight - initialPlayerHeight - PADDING;
	if (cameraHeight < MIN_CAMERAS_HEIGHT) {
		cameraHeight = MIN_CAMERAS_HEIGHT;
	}
	var camVideoHeight = cameraHeight - 30;

	var camVideoWidth, cameraWidth, quadWidth, camAnglesWidth;
	function setCameraWidths() {
		camVideoWidth = Math.round(camVideoHeight * 480 / 68);
		cameraWidth = Math.round(camVideoWidth / 4);
		quadWidth = Math.round(camVideoHeight * 116 / 68);
		camAnglesWidth = (cameraWidth * 4) + quadWidth;
	}

	setCameraWidths();
	if (camAnglesWidth > maxPlayerWidth) {
		camVideoHeight = Math.round(camVideoHeight * maxPlayerWidth / camAnglesWidth);
		setCameraWidths();
	}
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
	var quadCamOffset = quadCamImageWrapper.height() - cameraSizes.camVideoHeight;
	quadCamImage.attr("style", "width: " + cameraSizes.quadWidth + "px; height: " + cameraSizes.camVideoHeight + "px; " +
		                       "margin-bottom: -" + quadCamOffset + "px;");
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
	if (cameraSizes.camAnglesWidth > playerWidth) {
		cameraSizes = getCameraSizes(areaHeight, playerWidth);
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

// Highlights

var highlights;
var highlightsScreen;

function initHighlights() {
	highlights = $("#bbl-highlights");
	var highlightsContainer = highlights.find(".bbl-flashbacksContainer");
	highlightsScreen = highlightsContainer.find(".sc-screen");
	if (highlightsScreen && highlightsScreen.length) {
		updateHighlights();
		return;
	}
	highlights.bind("DOMNodeInserted", function() {
		highlightsContainer = highlights.find(".bbl-flashbacksContainer");
		if (highlightsContainer && highlightsContainer.length) {
			highlightsScreen = highlightsContainer.find(".sc-screen");
			updateHighlights();
		}
	});
}

function updateHighlights() {
	highlightsScreen.height(highlights.height() - 50);
}

// Twitter Feed

function initTweetFrame(tweetFrame) {
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

function initTweets() {
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
				initTweetFrame(tweetFrame);
			}
			else {
			    tweetFrame.on('load', function() {
					initTweetFrame(tweetFrame);
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
	initHighlights();
	initTweets();
}

function updateTabbedPanel(playerSize) {
	tabbedPanel.width(screenWidth - playerSize.width - (3 * PADDING));
	tabs.height(tabbedPanel.height() - 30);
	updateHighlights();
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
