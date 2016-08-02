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
			alertText.off("DOMNodeInserted");
			$("#bbl-alerts").remove();
		});
	});
}

function initScreen() {
	container = $("#bbl-container");
	initAlerts();
	initTabbedPanel();
	initTimeoutScreen();
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
					firstCamera.off("DOMNodeInserted");
					updateCamerasVideo(cameraSizes.camVideoWidth, cameraSizes.camVideoHeight);
				}
			}
		});
	}
}

// Play Area

var stillWatching;

function initTimeoutScreen() {
	stillWatching = container.children("#bbl-still-watching");
	if (!stillWatching.length) {
		container.bind("DOMNodeInserted", function() {
			stillWatching = container.children("#bbl-still-watching");
			if (stillWatching.length) {
				container.off("DOMNodeInserted");
				stillWatching.css("width", playerWrapper.width() - PADDING);
			}
		});
	}
}

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
					playerWrapper.off("DOMNodeInserted");
					updatePlayer(playerWidth, playerHeight);
				}
			}
		});
	}
	stillWatching.css("width", playerWidth - PADDING);
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
			highlights.off("DOMNodeInserted");
			highlightsScreen = highlightsContainer.find(".sc-screen");
			updateHighlights();
		}
	});
}

function updateHighlights() {
	highlightsScreen.height(highlights.height() - 50);
}

// Flashback

var flashbacks;
var fbCalendarWrapper;
var fbController;
var fbInitialized;

function initFlashbackNodes() {
	flashbacks = $("#bbl-flashbacks");
	if (!fbCalendarWrapper || !fbCalendarWrapper.length) {
		fbCalendarWrapper = flashbacks.children("div:first");
	}
	if (!fbController || !fbController.length) {
		fbController = flashbacks.children(".flashback-controller");
	}
	return (fbCalendarWrapper.length && fbController.length);
}

function initFlashback() {
	fbInitialized = initFlashbackNodes();
	flashbacks.height(tabbedPanel.height() - 30);
	updateFlashback();
	tabs = $("#bbl-tabs .bbl-tab");
	var fbCode = getURLParameter("fb");
	if (fbCode) {
		applyFlashbackCode(fbCode);
	}
	else {
		defaultFlashback();
	}
}

function updateFlashback() {
	if (!fbInitialized) {
		return;
	}
	var newHeight = flashbacks.height() - fbCalendarWrapper.height();
	fbController.height(flashbacks.height() - fbCalendarWrapper.height());
}

var AVAILABLE_FB_MONTHS = ["June", "July", "August", "September"];

function getFlashbackCode() {
	var code = "";

	// month
	var selectedMonth = flashbacks.find(".month-drop > a").text().trim().split(" ")[0];
	code += (AVAILABLE_FB_MONTHS.indexOf(selectedMonth) + 6);

	// day of month
	var selectedDay = flashbacks.find(".dow > a > div.active");
	if (!selectedDay.length) {
		return code;
	}
	var day = selectedDay.text();
	if (day.length < 2) {
		code += '0';	
	}
	code += day;

	// time
	code += "_";
	code += flashbacks.find(".time-hour > span").text();
	var minutes = flashbacks.find(".time-min > span").text();
	if (minutes !== "00") {
		code += minutes;
	}
	code += flashbacks.find(".time-ampm > span").text()[0];

	// camera
	code += "_";
	code += (flashbacks.find("#camera-selector .camerapicker > ul > li.active ").index() + 1);

	return code;
}

function applyFlashbackCode(code) {
	var parts = code.split("_");
	if (parts.length === 0) {
		console.log("WARN - flashback code not set");
		return;
	}
	
	// date
	var dateStr = parts[0];
	var monthDigits = dateStr.length - 2; 
	var month = parseInt(dateStr.substring(0, monthDigits));
	if (isNaN(month)) {
		console.log("WARN - could not identify flashback month", code);
		return;
	}
	var day = parseInt(dateStr.substring(monthDigits));
	if (isNaN(day)) {
		console.log("WARN - could not identify flashback day", code);
		return;
	}
	if (parts.length === 1) {
		defaultFlashback(month, day);
		return;
	}

	// time
	var time = parts[1];
	if (parts.length === 2) {
		defaultFlashback(month, day, time, null, true);
		return;
	}

	// camera
	var camera = parseInt(parts[2]);
	if (isNaN(camera)) {
		console.log("WARN - could not identify flashback camera", code);
		return;
	}
	defaultFlashback(month, day, time, camera, true);
}

function defaultFlashback(month, day, time, camera, watchNow) {
	var hour, minute, now;
	
	function setHourMinute() {
		var ap = time.slice(-1);
		if (ap !== "A" && ap !== "P") {
			ap = null;
		}
		var hasMinutes = (time.length > (ap ? 3 : 2));
		var hoursDigits = time.length - (ap ? 1 : 0) - (hasMinutes ? 2 : 0);

		// hour
		hour = parseInt(time.substring(0, hoursDigits));
		if (isNaN(hour)) {
			console.log("WARN - could not identify flashback hour", time);
			hour = 0;
			return;
		}
		if (ap === "P") {
			hour += 12;
		}

		// minute
		if (hasMinutes) {
			minute = parseInt(time.substring(hoursDigits, ap ? time.length - 1 : time.length));
			if (isNaN(minute)) {
				console.log("WARN - could not identify flashback minute", time);
				minute = 0;
			}
		}
		else {
			minute = 0;
		}
	}

	function getNow() {
		if (!now) {
			now = new Date();
		}
		return now;
	}

	if (!month) {
		month = getNow().getMonth() + 1;
	}
	if (!day) {
		day = getNow().getDate();
	}
	if (time) {
		setHourMinute();
	}
	else {
		hour = 0;
		minute = 0;
	}
	if (!camera) {
		camera = 1;
	}
	flashback(month, day, hour, minute, camera, watchNow);
}

function flashback(month, day, hour, minute, camera, watchNow) {

	function setDayOfMonth() {
		if (day < 1) {
			return;
		}
		var daysOfMonth = flashbacks.find(".dow:has(a)");
		if (daysOfMonth.length >= day) {
			$(daysOfMonth[day - 1]).children("a")[0].click();
		}	
	}

	function setHour() {
		var am = (flashbacks.find(".time-ampm > span").text() == "AM");
		var currentHour = parseInt(flashbacks.find(".time-hour > span").text());
		if (am) {
			if (currentHour === 12) {
				currentHour = 0;
			}
		}
		else {
			currentHour += 12;
		}
		var deltaHour = hour - currentHour;
		if (deltaHour > 0) {
			var upArrow = flashbacks.find(".time-hour > a.arrow-up")[0];
			while (deltaHour > 0) {
				upArrow.click();
				deltaHour--;
			}
		}
		else if (deltaHour < 0) {
			var downArrow = flashbacks.find(".time-hour > a.arrow-down")[0];
			while (deltaHour < 0) {
				downArrow.click();
				deltaHour++;
			}
		}
	}

	function setMinute() {
		var currentMinute = parseInt(flashbacks.find(".time-min > span").text());
		var deltaMinute = minute - currentMinute;
		if (deltaMinute > 0) {
			var upArrow = flashbacks.find(".time-min > a.arrow-up")[0];
			while (deltaMinute > 0) {
				upArrow.click();
				deltaMinute--;
			}
		}
		else if (deltaMinute < 0) {
			var downArrow = flashbacks.find(".time-min > a.arrow-down")[0];
			while (deltaMinute < 0) {
				downArrow.click();
				deltaMinute++;
			}
		}
	}

	function setCamera() {
		var cameraOption = flashbacks.find("#camera-selector .camerapicker > ul > li:nth-child(" + camera + ") a");
		if (cameraOption.length) {
			cameraOption[0].click();
		}
	}

	function completeFlashback() {
		setDayOfMonth();
		setHour();
		setMinute();
		setCamera();
		if (watchNow) {
			setTimeout(function() {
				flashbacks.find("#watch-button")[0].click();
			}, 100);
		}
	}

	function watchDaysOfMonth() {
		var activeDay = flashbacks.find(".dow > a > div.active");
		activeDay.bind("DOMSubtreeModified", function(event) {
			activeDay.off("DOMSubtreeModified");
			setTimeout(completeFlashback, 0);
		});
	}

	var selectedMonth = flashbacks.find(".month-drop > a").text().trim().split(" ")[0];
	var monthOption = flashbacks.find(".month-dropdown li:nth-child(" + (month - 5) + ") a");
	if (monthOption.length) {
		if (selectedMonth !== monthOption.text()) {
			watchDaysOfMonth();
			monthOption[0].click();
		}
		else {
			completeFlashback();
		}
	}
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
			tweetFrameBody.off("DOMNodeInserted");
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
			frameWrapper.off("DOMNodeInserted");
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
	updateFlashback();
}

// Document

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').
  		exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

$(document).ready(function() {
    console.log("## content: document ready");
	initScreen();
	layoutScreen();
	var playerSize = updatePlayArea();
	updateTabbedPanel(playerSize);
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("## content: dom available", event);
});

window.onload = function() {
	console.log("## content: window loaded");
	initFlashback();
};

$(window).resize(function() {
	layoutScreen();
	var playerSize = updatePlayArea();
	updateTabbedPanel(playerSize);
});

function sendChromeMessage(messageType, messageInfo, callback) {
	var request = {type: messageType, info: messageInfo};
  	chrome.runtime.sendMessage(request, function(response) {
 		if (chrome.runtime.lastError) {
        	console.log("## content: message request failed", chrome.runtime.lastError);
        	return;
     	}
     	if (callback) {
     		callback(response);
     	}
	});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("## content: chrome.runtime.onMessage", request, sender);
	if (request.type === "getFlashbackCode") {
		sendResponse({info: getFlashbackCode()});
		return;
	}
	if (request.type === "flashbackCode") {
		applyFlashbackCode(request.info);
		return;
	}
});

var extensionConnection = chrome.runtime.connect({name: "content-connection"});
extensionConnection.onMessage.addListener(function(msg) {
   console.log("content: extension.msg=" + msg);
});
