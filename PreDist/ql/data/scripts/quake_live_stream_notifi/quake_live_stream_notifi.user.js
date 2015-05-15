// ==UserScript==
// @id             qlstreamnotifier@phob.net
// @name           Quake Live Stream Notifier
// @version        0.59
// @namespace      phob.net
// @author         wn
// @contributor    cityy
// @description    Displays a list of live gaming streams on QuakeLive.com and ESReality.com
// @include        http://*.esreality.com/*
// @include        http://*.esreality.net/*
// @include        http://*.quakelive.com/*
// @exclude        http://*.esreality.com/w*
// @exclude        http://*.quakelive.com/forum*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @run-at         document-end
// @updateURL      https://userscripts.org/scripts/source/114449.meta.js
// ==/UserScript==


/**
 * Set up some stuff for user script updating
 */
var SCRIPT_NAME = "Quake Live Stream Notifier"
  , SCRIPT_VER  = "0.59"
  , GM_updatingEnabled = "GM_updatingEnabled" in window ? GM_updatingEnabled : false
  , isChrome = /chrome/i.test(navigator.userAgent)
  ;


/**
 * Based on:
 * GM_ API emulation for Chrome; 2009, 2010 James Campos
 * cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
 */
if (isChrome) {
  GM_getValue = function(aName, aDefaultValue) {
    var value = localStorage.getItem(aName);
    if (!value) return aDefaultValue;
    var type = value[0];
    value = value.substring(1);
    switch (type) {
      case "b":
        return value == "true";
      case "n":
        return Number(value);
      default:
        return value;
    }
  }
  GM_setValue = function(aName, aValue) {
    aValue = (typeof aValue)[0] + aValue;
    localStorage.setItem(aName, aValue);
  }
  GM_registerMenuCommand = function() {};
}


/**
 * Use an auto-update script if integrated updating isn't enabled
 * http://userscripts.org/scripts/show/38017
 * NOTE: Modified to add the new version number to the upgrade prompt
 *       and custom messages for Chrome users (requires a manual update).
 */
if (!GM_updatingEnabled) {
  var AutoUpdater_114449={id:114449,days:1,name:SCRIPT_NAME,version:SCRIPT_VER,time:new Date().getTime(),call:function(response,secure){GM_xmlhttpRequest({method:"GET",url:"http"+(secure?"s":"")+"://userscripts.org/scripts/source/"+this.id+".meta.js",onload:function(xpr){AutoUpdater_114449.compare(xpr,response)},onerror:function(xpr){if(secure){AutoUpdater_114449.call(response,false)}}})},enable:function(){GM_registerMenuCommand(this.name+": Enable updates",function(){GM_setValue("updated_114449",new Date().getTime()+"");AutoUpdater_114449.call(true,true)})},compareVersion:function(r_version,l_version){var r_parts=r_version.split("."),l_parts=l_version.split("."),r_len=r_parts.length,l_len=l_parts.length,r=l=0;for(var i=0,len=(r_len>l_len?r_len:l_len);i<len&&r==l;++i){r=+(r_parts[i]||"0");l=+(l_parts[i]||"0")}return(r!==l)?r>l:false},compare:function(xpr,response){this.xversion=/\/\/\s*@version\s+(.+)\s*\n/i.exec(xpr.responseText);this.xname=/\/\/\s*@name\s+(.+)\s*\n/i.exec(xpr.responseText);if((this.xversion)&&(this.xname[1]==this.name)){this.xversion=this.xversion[1];this.xname=this.xname[1]}else{if((xpr.responseText.match("the page you requested doesn't exist"))||(this.xname[1]!=this.name)){GM_setValue("updated_114449","off")}return false}var updated=this.compareVersion(this.xversion,this.version);if(updated&&confirm("A new version of "+this.xname+" is available.\nDo you wish to install the latest version ("+this.xversion+")?")){var path="http://userscripts.org/scripts/source/"+this.id+".user.js";if(isChrome){prompt("This script can't be updated automatically in Chrome.\nPlease uninstall the old version, and navigate to the URL provided below.",path)}else{try{window.parent.location.href=path}catch(e){}}}else{if(this.xversion&&updated){if(confirm("Do you want to turn off auto updating for this script?")){GM_setValue("updated_114449","off");this.enable();if(isChrome){alert("You will need to reinstall this script to enable auto-updating.")}else{alert("Automatic updates can be re-enabled for this script from the User Script Commands submenu.")}}}else{if(response){alert("No updates available for "+this.name)}}}},check:function(){if(GM_getValue("updated_114449",0)=="off"){this.enable()}else{if(+this.time>(+GM_getValue("updated_114449",0)+1000*60*60*24*this.days)){GM_setValue("updated_114449",this.time+"");this.call(false,true)}GM_registerMenuCommand(this.name+": Check for updates",function(){GM_setValue("updated_114449",new Date().getTime()+"");AutoUpdater_114449.call(true,true)})}}};AutoUpdater_114449.check();
}


/**
 * Only run if we're in the top frame
 */
if (window.self != window.top) {
  return;
}


/**
 * One-time user notifications
 */
if (!GM_getValue("qlsn_notified_20120510", false)) {
  GM_setValue("qlsn_notified_20120510", true);
  alert("This is a one-time notification.\n \n"
      + "By default this script will now only show streams claiming to show Quake games.\n"
      + "If you want to see other game streams, use the 'Change stream list' menu command\n"
      + "and enter \"all\" to show all tracked streams.\n \n"
      + "If you use Chrome and want to change the stream list, you will need to manually\n"
      + "edit this script's \"listDefault\" variable.");
}


/**
 * Global stuff
 */
var UPDATE_MS = 3E5 // 5 * 60 * 1000
  , RE_isESR = /^http:\/\/(?:\w+\.)?esreality\.(?:com|net)\/.*$/i
  , RE_okayChars = /^[\w .,`~!@#&*:\/\\\-=+?{}\(\)\[\]\|]+$/
  , RE_url = /^[\w .:\/\\\-=+?#&]+$/
  , isESR = RE_isESR.test(window.location.href)
  , srcBase = "http://phob.net/qlsn_{{list}}_streams.json"
  , listDefault = "quake"
  , jsonReq
  ;


/**
 * Potential sources in order of priority
 * NOTE: Intentionally duplicated the source so we try it again if the first
 *       request fails,  since it is quite likely something other than site
 *       downtime caused the failure.
 */
var src = srcBase.replace("{{list}}", GM_getValue("qlsn_list", listDefault))
  , listSources = [src, src]
  ;


/**
 * Updates the live stream bar
 * @param {Array} an array of live streams
 */
function updateBar(liveStreams) {
  var x = []
    , bar = document.getElementById("qlsn_bar")
    ;

  // Stop if we don't have any live streams
  if (!liveStreams.length) {
    bar.innerHTML = "<em title='Current list: " + GM_getValue("qlsn_list", listDefault) + "'>no live streams found</em>";
    return;
  }

  // Sort by stream name
  liveStreams.sort(function(a, b) {
    a = a.name.toLowerCase(), b = b.name.toLowerCase();
    return (a < b ? -1 : a > b ? 1 : 0);
  });

  // Generate and display the list
  for (var i = 0, e = liveStreams.length; i < e; ++i) {
    if (!(RE_okayChars.test(liveStreams[i].name)
        && RE_okayChars.test(liveStreams[i].game)
        && RE_url.test(liveStreams[i].url)
        && !isNaN(parseInt(liveStreams[i].viewers)))) {
      GM_log("Unexpected value(s) in: " + JSON.stringify(liveStreams[i]));
      continue;
    }
    x.push("<a href='" + liveStreams[i].url + "' "
          + " title='Game: " + liveStreams[i].game
          + ", Viewers: " + liveStreams[i].viewers + "' "
          + " class='qlsn_stream' target='_blank'>"
          + liveStreams[i].name + "</a>");
  }

  if (0 == x.length) {
    x = ["(error parsing stream list)"];
  }

  bar.innerHTML = "<strong><a href='http://userscripts.org/scripts/show/114449'"
    + "title='Current list: " + GM_getValue("qlsn_list", listDefault)
    + "' target='_blank'>LIVE NOW</a>:</strong>&nbsp;&nbsp;"
    + x.join("&nbsp;&nbsp;|&nbsp;&nbsp;");
}


/**
 * Get a new list of live streams.
 * Tries the fallback source if the first results in an error.
 * @param {Integer} an optional index specifying the list source to try
 * @param {Boolean} an optional flag to force a refresh
 */
function refreshList(aIndex, aForce) {
  // If we're within UPDATE_MS of the last good refresh, try to load from cache.
  // Currently only doing this for ESR, since QL doesn't actually reload often.
  var liveStreams
    , now = (new Date()).getTime()
    , fetchCache = GM_getValue("qlsn_fetchCache")
    , lastFetch = Number(GM_getValue("qlsn_lastFetch"))
    ;

  if (isESR && !aForce && fetchCache && lastFetch
      && (now - lastFetch < UPDATE_MS)) {
    try {
      fetchCache = JSON.parse(fetchCache);
      updateBar(fetchCache);
      return;
    }
    catch(e) {}
  }

  // Starting fresh
  liveStreams = [];
  GM_setValue("qlsn_fetchCache", "");

  // Default to the first source if not specified
  aIndex = aIndex || 0;

  // Make sure the index specified is valid, otherwise stop trying
  if ("undefined" == typeof listSources[aIndex]) {
    updateBar(liveStreams);
    return;
  }

  // Try updating with the current list source.
  // If it fails, retry using the next one.
  jsonReq = GM_xmlhttpRequest({
      method: "GET"
    , url: listSources[aIndex] + "?" + now

    , onload: function(res) {
        try {
          liveStreams = JSON.parse(res.responseText);
        }
        catch(e) {
          GM_log("Error parsing response from " + listSources[aIndex]
               + " (" + e + ")");
          refreshList(aIndex+1, aForce);
          return;
        }
        GM_setValue("qlsn_fetchCache", JSON.stringify(liveStreams));
        GM_setValue("qlsn_lastFetch", now+"");
        updateBar(liveStreams);
      }

    , onerror: function(res) {
        GM_log("Error requesting JSON from " + listSources[aIndex]
             + " (" + res.statusText + ")");
        refreshList(aIndex+1, aForce);
      }
  });
}


/**
 * Add a menu command to change the bar's background color
 */
GM_registerMenuCommand(SCRIPT_NAME + ": Change the bar color", function() {
  var color = prompt("Enter a CSS-friendly color without quotation marks.\n\n"
                   + "For example (without quotation marks): 'red' OR '#621300'\n\n"
                   , GM_getValue("qlsn_barColor", "#000"));
  if (!color) return;

  GM_setValue("qlsn_barColor", color);
  alert("Value set.  Please reload Quake Live.");
});


/**
 * Add a menu command to force a list refresh
 */
GM_registerMenuCommand(SCRIPT_NAME + ": Force list reload", function() {
  refreshList(null, true);
});


/**
 * Add a menu command to change the list source
 */
GM_registerMenuCommand(SCRIPT_NAME + ": Change stream list", function() {
  var pre = GM_getValue("qlsn_list", listDefault)
    , list = prompt("Enter (without quotes) either:\n \n"
                  + "'all': All streams, regardless of game.\n"
                  + "'quake': Default. All Quake-based (and likely Quake-based)"
                  + " streams.\n \n", pre)
    ;

  if (null == list || pre == list) {
    return;
  }

  list = list.replace(/^\s+|\s+$/g, "").toLowerCase();

  switch(list) {
    case "all":
      GM_setValue("qlsn_list", list);
      break;
    default:
      GM_setValue("qlsn_list", listDefault);
  }

  // Update the list source
  var src = srcBase.replace("{{list}}", GM_getValue("qlsn_list", listDefault));
  listSources = [src, src];

  // Force a refresh using the new source
  refreshList(null, true);
});


/**
 * Add the live stream bar
 */
GM_addStyle(
    "#qlsn_bar {margin: 0 auto; padding: 2px; background-color: "
  + GM_getValue("qlsn_barColor", "#000") + "; clear: both;}"
  + "#qlsn_bar em {color: #ccc; font-style: italic;}"
  + "#qlsn_bar strong {font-weight: bold;}"
  + "#qlsn_bar a {text-decoration: none;}"
  + "#qlsn_bar a.qlsn_stream {color: #ccc;}"
  + "#qlsn_bar a.qlsn_stream:hover {color: #fff;}"
);

// Styling unique to ESR or QL
if (isESR) {
  GM_addStyle("#qlsn_bar {font-size: 11px;}");
}
else {
  GM_addStyle("#qlsn_bar strong, #qlsn_bar strong a {color: #fc0;}");
}

var qlsnBar = document.createElement("div");
qlsnBar.setAttribute("id", "qlsn_bar");
qlsnBar.innerHTML = "<em>loading live streams&hellip;</em>";
document.body.insertBefore(qlsnBar, document.body.firstChild);


/**
 * Update the list every UPDATE_MS
 */
window.setInterval(function(){refreshList()}, UPDATE_MS);


/**
 * Load the list for the first time
 */
refreshList();
