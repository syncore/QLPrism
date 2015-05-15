/**
 * First of all, bind the Firefox Browser 'onload' event, after that we can bind
 * the 'gBrowser's event, which will trigger whenever a document is loaded and
 * that'll allow us to bind to that particulary document.
 */
window.addEventListener('load', function () {
var gBrowser = document.getElementById("browser_content"); // Prism fix (syncore)
gBrowser.addEventListener("load", function(e) {
		var d = e.target, w = d.defaultView.wrappedJSObject;

		// Root document!
		if (d instanceof HTMLDocument && w.location.href.match(/^http:\/\/?(www\.)?quakelive\.com?(\/)(?!forum.*)/i) && !d.defaultView.frameElement) {
			QLDP.init(d, w);
		}
}, true);
}, true);
