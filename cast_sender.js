(function() {
	var d=function(){
		var a=window.navigator.userAgent.match(/Chrome\/([0-9]+)/);
		return a?50<=parseInt(a[1],10):!1
	},
	e=document.currentScript&&-1!=document.currentScript.src.indexOf("?loadGamesSDK")?"/cast_game_sender.js":"/cast_sender.js",
	f=["boadgeojelhgndaghljhdicfkmllpafd","dliochdbjfkdbacpmhlcpmleaejidimm","enhhojjnijigcajfphajepfemndkmdlo","fmfcbgogabcbclcofgocippekhfcmgfj"],
	g=["pkedcjkdefgpdelpbcmbmeomcjbeemfm","fjhoaacokmgbjemoflkofnenfaiekifl"],
	h=d()?g.concat(f):f.concat(g),
	k=function(a,c){
		var b=new XMLHttpRequest;
		b.onreadystatechange=function(){
			4==b.readyState&&200==b.status&&c(!0)
		};
		b.onerror=function(){
			c(!1)};
			try{
				b.open("GET",a,!0),b.send()
			}
			catch(n){
				c(!1)
			}
		},
		p=function(a){
			if(a>=h.length)
				l();
			else{
				var c=h[a],b="chrome-extension://"+c+e;
				0<=f.indexOf(c)?k(b,function(n){
					n?(window.chrome.cast=window.chrome.cast||{},window.chrome.cast.extensionId=c,m(b,l)):p(a+1)
				}):m(b,function(){p(a+1)})}},m=function(a,c){var b=document.createElement("script");b.onerror=c;b.src=a;(document.head||document.documentElement).appendChild(b)},
l=function(){var a=window.__onGCastApiAvailable;a&&"function"==typeof a&&a(!1,"No cast extension found")};a:{if(0<=window.navigator.userAgent.indexOf("CriOS")){var q=window.__gCrWeb&&window.__gCrWeb.message&&window.__gCrWeb.message.invokeOnHost;if(q){q({command:"cast.sender.init"});break a}}if(window.chrome){var r=window.navigator.userAgent;if(0<=r.indexOf("Android")&&0<=r.indexOf("Chrome/")&&window.navigator.presentation){var t=d()?"50":"";m("//www.gstatic.com/eureka/clank"+t+e,l)}else p(0)}else l()};})();
