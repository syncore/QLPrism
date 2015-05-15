// ==UserScript==
// @name         Quake Live New Alt Browser
// @version      1.67
// @namespace    http://userscripts.org/scripts/show/73076
// @homepage     http://userscripts.org/scripts/show/73076
// @description  A new redesign of the Quake Live server browser.
// @icon         https://phob.net/ql_new_alt_browser/thumb.png
// @screenshot   https://phob.net/ql_new_alt_browser/large.png https://phob.net/ql_new_alt_browser/thumb.png
// @author       wn
// @include      http://*.quakelive.com/*
// @exclude      http://*.quakelive.com/forum*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at       document-end
// @updateURL    https://userscripts.org/scripts/source/73076.meta.js
// ==/UserScript==


/**
 * Set up some stuff for user script updating and menu commands.
 */
var SCRIPT_NAME = "Quake Live New Alt Browser"
  , SCRIPT_VER  = "1.67"
GM_updatingEnabled = "GM_updatingEnabled" in window ? GM_updatingEnabled : false;


// Set up some utility things
var DEBUG = false
  , DOLITTLE = function() {}
  , logMsg = DEBUG ? function(aMsg) {GM_log(aMsg)} : DOLITTLE
  , logError = function(aMsg) {GM_log("ERROR: " + aMsg)};


/**
 * Evaluate code in the page context.
 * Source: http://wiki.greasespot.net/Content_Script_Injection
 */
function contentEval(source) {
  // Check for function input.
  if ("function" == typeof(source)) {
    source = "(" + source + ")();";
  }

  // Create a script node holding this source code.
  var script = document.createElement("script");
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
}


// Don't bother if we're missing critical GM_ functions
if ("undefined" == typeof(GM_xmlhttpRequest)) {
  alert("Your browser/add-on doesn't support GM_xmlhttpRequest, which is "
      + "required for " + SCRIPT_NAME + " to operate.");
  return;
}


/**
 * Based on:
 * GM_ API emulation for Chrome; 2009, 2010 James Campos
 * cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
 */
if (window.chrome) {
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
}

if (window.chrome || "undefined" == typeof(GM_registerMenuCommand)) {
  GM_registerMenuCommand = DOLITTLE;
}


/**
 * Use an auto-update script if integrated updating isn't enabled
 * http://userscripts.org/scripts/show/38017
 * NOTE: Modified to add the new version number to the upgrade prompt
 *       and custom messages for Chrome users (requires a manual update).
 */
if (!GM_updatingEnabled) {
  var AutoUpdater_73076={id:73076,days:1,name:SCRIPT_NAME,version:SCRIPT_VER,time:new Date().getTime(),call:function(response,secure){GM_xmlhttpRequest({method:"GET",url:"http"+(secure?"s":"")+"://userscripts.org/scripts/source/"+this.id+".meta.js",onload:function(xpr){AutoUpdater_73076.compare(xpr,response)},onerror:function(xpr){if(secure){AutoUpdater_73076.call(response,false)}}})},enable:function(){GM_registerMenuCommand(this.name+": Enable updates",function(){GM_setValue("updated_73076",new Date().getTime()+"");AutoUpdater_73076.call(true,true)})},compareVersion:function(r_version,l_version){var r_parts=r_version.split("."),l_parts=l_version.split("."),r_len=r_parts.length,l_len=l_parts.length,r=l=0;for(var i=0,len=(r_len>l_len?r_len:l_len);i<len&&r==l;++i){r=+(r_parts[i]||"0");l=+(l_parts[i]||"0")}return(r!==l)?r>l:false},compare:function(xpr,response){this.xversion=/\/\/\s*@version\s+(.+)\s*\n/i.exec(xpr.responseText);this.xname=/\/\/\s*@name\s+(.+)\s*\n/i.exec(xpr.responseText);if((this.xversion)&&(this.xname[1]==this.name)){this.xversion=this.xversion[1];this.xname=this.xname[1]}else{if((xpr.responseText.match("the page you requested doesn't exist"))||(this.xname[1]!=this.name)){GM_setValue("updated_73076","off")}return false}var updated=this.compareVersion(this.xversion,this.version);if(updated&&confirm("A new version of "+this.xname+" is available.\nDo you wish to install the latest version ("+this.xversion+")?")){var path="http://userscripts.org/scripts/source/"+this.id+".user.js";if(window.chrome){prompt("This script can't be updated automatically in Chrome.\nPlease uninstall the old version, and navigate to the URL provided below.",path)}else{try{window.parent.location.href=path}catch(e){}}}else{if(this.xversion&&updated){if(confirm("Do you want to turn off auto updating for this script?")){GM_setValue("updated_73076","off");this.enable();if(window.chrome){alert("You will need to reinstall this script to enable auto-updating.")}else{alert("Automatic updates can be re-enabled for this script from the User Script Commands submenu.")}}}else{if(response){alert("No updates available for "+this.name)}}}},check:function(){if(GM_getValue("updated_73076",0)=="off"){this.enable()}else{if(+this.time>(+GM_getValue("updated_73076",0)+1000*60*60*24*this.days)){GM_setValue("updated_73076",this.time+"");this.call(false,true)}GM_registerMenuCommand(this.name+": Check for updates",function(){GM_setValue("updated_73076",new Date().getTime()+"");AutoUpdater_73076.call(true,true)})}}};AutoUpdater_73076.check();
}


// Don't bother if Quake Live is down for maintenance
if (/offline/i.test(document.title)) {
  return;
}

// Make sure we're on top
if (window.self != window.top) {
  return;
}


/**
 * Set up content-side utilities and initialize listener for GM-side things
 * NOTE: 'var' left off intentionally so other sections can hit it.
 */
contentEval(function() {
// Content-side definition of GM_addStyle
if ("undefined" == typeof(GM_addStyle)) {
  GM_addStyle = function(css) {
    var head = document.getElementsByTagName("head")[0];
    if (head) {
      var style = document.createElement("style");
      style.textContent = css;
      style.type = "text/css";
      head.appendChild(style);
    }
  }
}

// The content<->GM mediator (and other useful stuff)
QLNAB = {
  // Logging
  logMsg: function(aMsg) {
    if ("platform" in window || !(console && console.log)) {
      QLNAB.logMsg = function() {};
    }
    else {
      QLNAB.logMsg = function(aMsg) {QLNAB.PREFS["debug"] && console.log("QLNAB: " + aMsg)};
      QLNAB.logMsg(aMsg);
    }
  },

  logError: function(aMsg) {
    if ("platform" in window || !(console && console.log)) {
      QLNAB.logError = function() {};
    }
    else {
      QLNAB.logError = function(aMsg) {QLNAB.logMsg("ERROR: " + aMsg)};
      QLNAB.logError(aMsg);
    }
  },

  PREFS: {},

  prefHandlers: {},

  addHandler: function(aPref, aHandler) {
    if (!(aPref in QLNAB.prefHandlers)) {
      QLNAB.prefHandlers[aPref] = [];
    }
    QLNAB.prefHandlers[aPref].push(aHandler);
  },

  // Trigger pref handler (or handlers) with the current pref value
  trigger: function(aPref) {
    if (aPref in QLNAB.PREFS && aPref in QLNAB.prefHandlers) {
      for (var i = 0, e = QLNAB.prefHandlers[aPref].length; i < e; ++i) {
        QLNAB.prefHandlers[aPref][i].call(null, QLNAB.PREFS[aPref]);
      }
    }
  },

  // Message prefix
  RE_msg: /^QLNAB:/,

  handleMessage: function(aEvent) {
    if (!(aEvent && aEvent.data)) {
      return;
    }

    var response;
    try {
      response = JSON.parse(aEvent.data);
    }
    catch(e) {
      return QLNAB.logError("handleMessage: " + e);
    }

    // Make sure we have everything required for a QLNAB message
    if (!("type" in response && "name" in response && "value" in response)) {
      return;
    }

    // Make sure this is a QLNAB message
    if (!QLNAB.RE_msg.test(response.type)) {
      return;
    }

    switch (response.type.replace(QLNAB.RE_msg, "")) {
      case "setPref":
        QLNAB.logMsg("setting preference '" + response.name + "' => '" + response.value + "'");
        QLNAB.PREFS[response.name] = response.value;
        QLNAB.trigger(response.name);
        break;
    }
  }
};

// Toggle gametype icon display
QLNAB.addHandler("ql_alt_gametypeIcon", function(newVal) {
  // show gametype image rather than text
  if (newVal) {
    $("#qlv_postlogin_matches tbody span.agameicon").each(function() {
      $(this).replaceWith("<img class='agameicon' src='" + $(this).attr("src")
                        + "' title='" + $(this).text() + "' />");
    });
  }
  // show gametype text rather than image
  else {
    $("#qlv_postlogin_matches tbody img.agameicon").each(function() {
      $(this).replaceWith("<span class='agameicon' src='"
                        + $(this).attr("src") + "'>"
                        + $(this).attr("title") + "</span>");
    });
  }
});

// Toggle best pick highlighting
QLNAB.addHandler("ql_alt_bestPickHighlight", function(newVal) {
  $("#qlv_postlogin_matches tbody tr.bestpick").toggleClass("noHighlight", !newVal);
});

window.addEventListener("message", QLNAB.handleMessage, false);
}); // end of call to contentEval


/**
 * This does the following:
 *   - Sets the GM preference
 *   - Tells the content script to set the preference and notify any handlers
 */
function changePref(aName, aValue) {
  GM_setValue(aName, aValue);
  window.postMessage(JSON.stringify({
    "type": "QLNAB:setPref",
    "name": aName,
    "value": aValue
  }), "*");
}

/**
 * Create our menu commands
 */
GM_registerMenuCommand(SCRIPT_NAME + ": toggle gametype icon", function() {
  changePref("ql_alt_gametypeIcon", !GM_getValue("ql_alt_gametypeIcon", true));
});

GM_registerMenuCommand(SCRIPT_NAME + ": toggle recommended server highlighting", function() {
  changePref("ql_alt_bestPickHighlight", !GM_getValue("ql_alt_bestPickHighlight", true));
});


/**
 * Initialize the content side with our preferences
 */
changePref("debug", DEBUG);
changePref("ql_alt_bestPickHighlight", !!window.chrome ? false : GM_getValue("ql_alt_bestPickHighlight", true));
changePref("ql_alt_gametypeIcon", GM_getValue("ql_alt_gametypeIcon", true));


/**
 * Important one-time notifications
 */
if (!GM_getValue("ql_alt_notified_newFilter", false)) {
  GM_setValue("ql_alt_notified_newFilter", true);
  contentEval(function() {
  // Poll every 2 seconds
  var notifier = setInterval(function() {
    // Unlikely, but don't interfere if the game is running.
    if ($("#qlv_user_data").length && !quakelive.IsGameRunning()) {
      clearInterval(notifier);
      var msg = "Hello!  This latest update includes some nice changes you might not immediately notice:<br/><br/>"
              + "<ul><li style='margin-bottom:1em'><b>Server filtering:</b> Filtering has been improved.  "
              + "For example:<br/><br/>An Include filter of <code>'New York + CTF, Frankfurt + qlnab.open'</code> means "
              + "<code>'Include New York CTF servers OR any Frankfurt server with open slots'</code>.<br/><br/>"
              + "An Include filter of <code>'Paris + Duel, CA + Asylum + qlnab.open'</code> means "
              + "<code>'Include any Paris duel server OR any clan arena server on Asylum with open slots'</code>.</li>"
              + "<li><b>Sort order persistence:</b>  If you sort the list a certain way, the order will be remembered across page loads.  "
              + "You can sort on multiple columns by holding down the <code>Shift</code> key while clicking.</li></ul>";
      qlPrompt({
        title: "Quake Live New Alt Browser Notice",
        body: msg,
        fatal: false,
        alert: true
      });
    }
  }, 2E3);
  }); // end of call to contentEval
}


/**
 * Stylin'
 */
GM_addStyle(".postlogin_nav ul li { font-weight:bold; }" +
    "#ql_alt_filters_include, #ql_alt_filters_exclude { width: 90%; border:1px solid black; margin-top:1em; }" +
    "#ql_alt_filters_exclude { margin-bottom: 1em; }" +
    "#qlv_postlogin_matches p { background: transparent; }" +
    // width: 1280+ = 100%, 1152-1279 = 94%, 1024-1151 = 85%, < 1024 = 52%
    "#ql_alt_browser { width: " + (screen.width < 1280 ? screen.width < 1024 ? "52%" : screen.width < 1152 ? "85%" : "94%" : "100%") + "; color: black; background-color: rgba(255, 255, 255, 0.4); }" +
    "#ql_alt_browser thead th { padding: 6px 0; cursor: pointer; color: white; font-weight: bold; text-shadow: 1px 1px 5px #666; filter: dropshadow(color=#666, offx=1, offy=1); }" +
    "#ql_alt_browser thead th.headerSortUp, .bestpick, .filter_enabled { text-shadow: 1px 1px 5px #f00; filter: dropshadow(color=#f00, offx=1, offy=1); }" +
    "#ql_alt_browser thead th.headerSortDown { text-shadow: 1px 1px 5px #fb4; filter: dropshadow(color=#fb4, offx=1, offy=1); }" +
    ".noHighlight { text-shadow: none; filter: none; }" +
    ".alocation_flag { width: 16px; height: 11px }" +
    ".agameicon { padding: 1px 0 }" +
    ".agameicon span { display: none; }" +
    ".agameicon + .agamemods { position: static; display: none; height: 21px; }" +
    "span.agameicon + .agamemods { height: auto; position: relative; bottom: -1px; }" +
    ".alocation_text, .agameicon, .amapname, .agamelabel, .aplayers { cursor: default; }" +
    ".agamerank { float: left; height: 18px; width: 18px; }" +
    ".aplayers { padding-left: 4px; }" +
    ".header, .headerSortUp, .headerSortDown { background: transparent; font-size: 100%; }" +
    ".normalZebraOff,.blueZebraOff,.redZebraOff,.normalZebraOn,.blueZebraOn,.redZebraOn,.teamZebraOff,.teamZebraOn { background-image: none; }" +
    ".odd, .normalZebraOn { background-color: rgba(204, 204, 204, 0.35); }" +
    ".odd:hover, .normalZebraOn:hover { background-color: rgba(219, 219, 219, 1); }" +
    ".even, .normalZebraOff { background-color: rgba(255, 255, 255, 0.35); }" +
    ".even:hover, .normalZebraOff:hover { background-color: rgba(235, 235, 235, 1); }" +
    ".link { cursor: pointer; }" +
    ".link.share_link_img { float: left; margin-top: 3px; margin-left: 4px; }" +
    ".cond { letter-spacing: -1px; }" +
    ".bold { font-weight: 600; }"
);

// NOTE: this is required to get access to 'quakelive.resource'
contentEval(function() {
  // Chrome doesn't let a background image cross multiple cells, so make it black.
  GM_addStyle("#ql_alt_browser thead tr { background: "
            + (!!window.chrome ? "black" : ("url('"
            + quakelive.resource('/images/postlogin_navbar/nav_bar.png')
            + "') -10px 0px")) + "; }");
});


/**
 * Create tablesorter parsers
 */
contentEval(function() {
// Player sorting (e.g. 7/8)
$.tablesorter.addParser({
  id: "players",
  is: function(s) {
    return false;
  },
  format: function(s) {
    var sp = s.split("/");
    return parseFloat(sp[0] + "." + (sp[1] << 2));
  },
  type: "numeric"
});
$.tablesorter.addParser({
  id: "rank",
  is: function(s) {
    return false;
  },
  format: function(s) {
    s = s.substr(s.indexOf("rank_") + 5, 1);
    return (s == "p" ? -9 : s);
  },
  type: "numeric"
});

// Sort persistence
$.tablesorter.addWidget({
  id: "sortPersist",
  format: function(table) {
    if (table.config.debug) {
      var time = new Date();
    }
    var key = "ql_alt_browser_sort";
    var val = localStorage.getItem(key);

    var data = {};
    var sortList = table.config.sortList;
    var tableId = $(table).attr("id");
    var valExists = (typeof(val) != "undefined" && val != null);
    if (sortList.length > 0) {
      if (valExists) {
        data = JSON.parse(val);
      }
      data[tableId] = sortList;
      localStorage.setItem(key, JSON.stringify(data));
    }
    else {
      if (valExists) {
        var data = JSON.parse(val);
        if (typeof(data[tableId]) != "undefined" && data[tableId] != null) {
          sortList = data[tableId];
          if (sortList.length > 0) {
            $(table).trigger("sorton", [sortList]);
          }
        }
      }
    }
    if (table.config.debug) {
      $.tablesorter.benchmark("Applying sortPersist widget", time);
    }
  }
});
}); // end of call to contentEval


/**
 * Set up the prototype for a server manager listener
 */
contentEval(function() {
function qlnabServerManagerListener() {
  qlnabServerManagerListener.prototype.OnRefreshServersSuccess = function() {};
  qlnabServerManagerListener.prototype.OnRefreshServersError = function() {};
  qlnabServerManagerListener.prototype.OnStartRefreshServers = function() {};
  qlnabServerManagerListener.prototype.OnSaveFilterSuccess = function() {};
  qlnabServerManagerListener.prototype.OnSaveFilterError = function() {};
}


/**
 * Set up the prototype for the server list view
 */
var cols = 6;
var o = {
  target: "ql_alt_browser tbody",
  max: 0,
  group_cache_size: 6
}

function qlnabServerListView() {}
qlnabServerListView.prototype = new qlnabServerManagerListener;

qlnabServerListView.prototype.SetDisplayProps = function(d) {
  this.props = $.extend({}, o, d);
}

qlnabServerListView.prototype.GetContainerNodeId = function() {
  return this.props.target;
}

qlnabServerListView.prototype.GetServerNodeId = function(d) {
  return "match_" + d.public_id;
}

qlnabServerListView.prototype.UpdateServerNode = function(server, $row) {
  var gametype = mapdb.getGameTypeByID(server.game_type);
  var gtTitle = gametype.name.toUpperCase() + " - " + gametype.title;
  var gameLabel = " (" + (server.premium ? "Premium " : "") + server.host_name + ")";
  var rank = GetSkillRankInfo(server.skillDelta);
  var max_players = server.teamsize > 0 ? server.teamsize * (gametype.name == "ffa" ? 1 : 2) : server.max_clients;
  var players = server.num_clients + "/" + max_players;

  var map = mapdb.getBySysName(server.map.toLowerCase());
  map = map ? map.name : "Unknown";

  var locName, locObj, flagURL;
  if (locObj = locdb.GetByID(server.location_id)) {
    // From /user/load locations
    locName = locObj.GetCityState() + (InArray(server.location_id, [14,27,29,32,37,43]) ?
        " #1" : InArray(server.location_id, [30,33,34,36,39,42,44]) ?
        " #2" : InArray(server.location_id, [51]) ?
        " #3" : "");
    flagURL = locObj.GetFlagIcon();
  }
  else {
    locName = "QUAKE LIVE";
    flagURL = "/images/flags3cc/usa.gif";
  }

  if ($row.find(".qlv_inner_line").length == 0) {
    $row.html("<td class='qlv_inner_line'><img class='alocation_flag' src='' /></td>" +
           "<td align='left' class='alocation_text'></td>" +
           "<td align='left'><img src='' class='agameicon' /><div class='agamemods'></div></td>" +
           "<td align='left'><span class='amapname bold'></span><span class='agamelabel cond'></span></td>" +
           "<td align='left'><img src='' class='agamerank' /> <a href='" + quakelive.siteConfig.baseUrl + "/r/join/" + server.public_id + "' onclick='qlPrompt({title: \"Server Link\", body: \"Link to this game\", input: true, inputLabel: $(this).attr(\"href\"), inputReadOnly: true, alert: true}); return false;' class='link share_link_img' title='Link to this game'></a></td>" +
           "<td align='left' class='aplayers'></td>");
  }

  $row.find(".alocation_flag").attr({"src": quakelive.resource(flagURL), "title": locObj.country || "United States"});
  $row.find(".alocation_text").text(locName);

  $row.find(".agameicon").attr({"src": quakelive.resource("/images/gametypes/sm/" + gametype.name + ".png"), "title": gtTitle});
  var mods = []
    , useMods = server.owner && (server.ruleset != 1 || server.g_customSettings != 0);
  if (useMods) {
    mods = server.GetModifiedSettings();
    $row.find(".agamemods")
        .html("<div class='modified_icon'></div>")
        .css("display", "inline-block")
        .find(".modified_icon")
        .data("mods", mods)
        .hover(function(e) {
          var $tip = $("#agamemods_tip");
          if (0 == $tip.length) {
            $("body").append("<div id='agamemods_tip'></div>");
            $tip = $("#agamemods_tip");
            $tip.css({
              position: "absolute",
              width: "auto",
              background: "rgba(235, 235, 235, 1)",
              "background-position": "-7px",
              color: "#000",
              border: "1px solid #000",
              padding: "10px",
              "z-index": 999
            })
            .mouseleave(function() { $(this).hide(); });
          }
          $tip.css({
            left: (e.pageX - 0) + "px",
            top:  (e.pageY + 10) + "px",
          })
          .html("<b>Server Modifications:</b><br />" + $(this).data("mods").join("<br />"))
          .show();
        }, function() {
          $("#agamemods_tip").hide();
        });
  }
  else {
    $row.find(".agamemods").hide();
  }

  $row.find(".amapname").text(map);
  $row.find(".agamelabel").html(gameLabel);
  $row.find(".agamerank").attr({"src": quakelive.resource((server.g_needpass ? "/images/lgi/server_details_ranked.png" : "/images/sf/login/rank_" + rank.delta + ".png")), "title": rank.desc.replace(/(<([^>]+)>)/ig, '')});
  $row.find(".aplayers").text(players).attr("title", server.max_clients + " slots");
  server.ordinal < 3 ? $row.addClass("bestpick") : $row.removeClass("bestpick");

  var ql_alt_filters_exclude = localStorage.getItem("ql_alt_filters_exclude"),
      ql_alt_filters_include = localStorage.getItem("ql_alt_filters_include"),
      show_entry = true,
      hide_entry = false,
      RE_comma = /\s*,\s*/,
      RE_plus = /\s*\+\s*/,
      RE_escapeMe = /([\^\$\\\/\(\)\|\?\+\*\[\]\{\}\,\.])/g,
      modsFilter = mods.slice(0),
      freg;

  // Add mod keywords "mods" and "modifications"
  modsFilter.push("mods");
  modsFilter.push("modifications");
  modsFilter = modsFilter.join("\t");

  // Include filtering
  if (ql_alt_filters_include) {
    ql_alt_filters_include = ql_alt_filters_include.split(RE_comma);
    if (ql_alt_filters_include[0]) {
      // Assume we will hide the entry
      show_entry = false;

      // Split each filter value on +'s to get subfilters
      var subfilters = [];
      for (var i = 0, j = ql_alt_filters_include.length; i < j; ++i) {
        if (0 == ql_alt_filters_include[i].length) {
          continue;
        }
        subfilters.push(ql_alt_filters_include[i].split(RE_plus));
      }

      // Check each subfilter...
      for (var i = 0, j = subfilters.length; i < j; ++i) {
        var submatch = true;
        // Check this subfilter's components...
        for (var x = 0, y = subfilters[i].length; x < y; ++x) {
          if (0 == subfilters[i][x].length) {
            continue;
          }
          freg = new RegExp(subfilters[i][x].replace(RE_escapeMe, "\\$1"), "i");
          // If nothing matches, this is not part of an acceptable subfilter.
          if (!(("qlnab.open" == subfilters[i][x] && server.num_players < max_players)
              || players.substr(players.indexOf("/")) == subfilters[i][x]
              || locName.match(freg)
              || gtTitle.match(freg)
              || (useMods && modsFilter.match(freg))
              || gameLabel.match(freg)
              || ((server.map.match(freg) || map.match(freg)) && server.num_clients !== 0)
          )) {
            submatch = false;
            break;
          }
        }
        // Show entry if this subfilter was completely matched.
        show_entry = show_entry || submatch;
      }
    }
  }

  // Exclude filtering
  if (ql_alt_filters_exclude) {
    ql_alt_filters_exclude = ql_alt_filters_exclude.split(RE_comma);
    if (ql_alt_filters_exclude[0]) {
      // Assume we will not hide the entry
      hide_entry = false;

      // Split each filter value on +'s to get subfilters
      var subfilters = [];
      for (var i = 0, j = ql_alt_filters_exclude.length; i < j; ++i) {
        if (0 == ql_alt_filters_exclude[i].length) {
          continue;
        }
        subfilters.push(ql_alt_filters_exclude[i].split(RE_plus));
      }

      // Check each subfilter...
      for (var i = 0, j = subfilters.length; i < j; ++i) {
        var submatch = true;
        // Check this subfilter's components...
        for (var x = 0, y = subfilters[i].length; x < y; ++x) {
          if (0 == subfilters[i][x].length) {
            continue;
          }
          freg = new RegExp(subfilters[i][x].replace(RE_escapeMe, "\\$1"), "i");
          // If nothing matches, this is not part of an acceptable subfilter.
          if (!(("qlnab.open" == subfilters[i][x] && server.num_players < max_players)
              || players.substr(players.indexOf("/")) == subfilters[i][x]
              || locName.match(freg)
              || gtTitle.match(freg)
              || (useMods && modsFilter.match(freg))
              || gameLabel.match(freg)
              || ((server.map.match(freg) || map.match(freg)) && server.num_clients !== 0)
          )) {
            submatch = false;
            break;
          }
        }
        // Hide entry if one of the subfilters matched.
        if (submatch) {
          hide_entry = true;
          break;
        }
      }
    }
  }

  $row.css("display", show_entry && !hide_entry ? "table-row" : "none");

  return $row;
};

qlnabServerListView.prototype.OnRefreshServersSuccess = function(d) {
  quakelive.SendModuleMessage("OnServerListReload", d);
  this.DisplayServerList(d);
  this.SortServerList(d);
  $("#agamemods_tip").remove();
}

qlnabServerListView.prototype.OnRefreshServersError = function() {
  var d = $("#" + this.GetContainerNodeId()).empty();
  d.append("<tr><td colspan='" + cols + "'><p class='tc TwentyPxTxt midGrayTxt' style='width: 70%; margin: 20% auto; color: #f00'>We've encountered an error loading the list of games. Please wait and we will try to reload the list.</p></td></tr>");
}

qlnabServerListView.prototype.OnBeforeDisplayServerList = function(d, e) {
  e.length > 0 && $("#qlv_welcome .welcome_matches_header").css("visibility", "visible");
}

qlnabServerListView.prototype.OnAfterDisplayServerList = function(d, e) {
  var $tbody = $("#ql_alt_browser tbody");
  if (e.length == 0) {
    d.append("<tr><td colspan='" + cols + "'><p class='tc thirtyPxTxt midGrayTxt'>No Games Available</p></td></tr>");
    quakelive.siteConfig.realm == "focus" ?
        d.append("<tr><td colspan='" + cols + "'><p class='tc TwentyPxTxt midGrayTxt'>A focus test may not be active at this time.<br />Please check the News Feed for scheduled test times.</p></td></tr>")
        : d.append("<tr><td colspan='" + cols + "'><p class='tc TwentyPxTxt midGrayTxt'>Check Your Customize Settings</p></td></tr>");
  }
  // If there are servers in the list...
  else {
    if (0 == $tbody.find("tr:visible").length) {
      $tbody.append("<tr><td colspan='" + cols + "'><p class='tc TwentyPxTxt midGrayTxt'>All servers have been hidden by the Alt Browser.  Check your filters.</p></td></tr>");
    }
  }
}

qlnabServerListView.prototype.OnBeforeUpdateServerNode = function(d, e) {}

qlnabServerListView.prototype.OnRemoveServer = function(d, e) {
  d = $("#" + this.GetServerNodeId(e));
  d.length > 0 && d.remove();
  quakelive.matchtip.HideMatchTooltip(e.public_id);
}

qlnabServerListView.prototype.OnUpdateServer = function(d, e) {
  d = $("#" + this.GetServerNodeId(e));
  if (d.length == 0) {
    d = $("<tr id='" + this.GetServerNodeId(e) + "'></tr>");
    e.node = d;
  }
  this.SetupContextMenu(e, d);
  this.UpdateServerNode(e, d);
}

qlnabServerListView.prototype.DisplayServerList = function(g) {
  var m = $("#" + this.GetContainerNodeId());
  g = g.GetServers();
  m.empty();
  this.OnBeforeDisplayServerList(m, g);
  if (g.length > 0) {
    for (var x = this, p = [], z = 0, t = 0; t < g.length; t += this.props.group_cache_size) {
      for (var o = [], l = 0; l < this.props.group_cache_size && t + l < g.length; l++) {
        var u = g[t + l];
        o[l] = u.public_id;
        p[z] = o
      }
      z++;
    }
    var k = function() {
      $(".contextMenu").destroyContextMenu().hide();
    }
    z = {
      onHover: k,
      onClick: k,
      onDblClick: k,
      target: this.props.target
    };
    o = this.props.max == 0 ? g.length : this.props.max;
    for (t = 0; t < o; ++t) {
      u = g[t];
      z.cachedServerIds = p[parseInt(t / this.props.group_cache_size)];
      quakelive.matchtip.BindMatchTooltip(u.node, u.public_id, z);
      m.append(u.node)
    }
    m = m.find("tr");

    QLNAB.trigger("ql_alt_bestPickHighlight");
    QLNAB.trigger("ql_alt_gametypeIcon");
  }
  this.OnAfterDisplayServerList(m, g)
}

qlnabServerListView.prototype.SortServerList = function() {
  var $qab = $("#ql_alt_browser");
  var sortList;
  try {
    sortList = $qab.length ? $qab.get(0).config.sortList : [[5,1]];
  }
  catch(e) {
    QLNAB.logError("SortServerList: " + e);
    sortList = [[5,1]];
  }

  // Append the Players column to the sort list if it isn't already there.
  var hasPlayers = false;
  for (var i = 0, e = sortList.length; i < e; ++i) {
    if (sortList[i][0] == 5) {
      hasPlayers = true;
      break;
    }
  }
  if (!hasPlayers) {
    sortList[sortList.length] = [5,1];
  }

  $qab.trigger("update");
  $qab.trigger("sorton", [sortList]);
}

qlnabServerListView.prototype.MatchContextMenuHandler = function(e, g) {
  var k = g.data("info"), module = quakelive.mod_home;
  switch (e) {
  case "copy":
    qlPrompt({
      input: true,
      readonly: true,
      alert: true,
      title: "Link to this match",
      body: "Use the URL below to link to this match directly.",
      inputLabel: quakelive.siteConfig.baseUrl + "/r/join/" + k.public_id
    });
    break;
  case "join":
    g.dblclick();
    break;
  case "filter_map":
    module.filter.filters.arena = k.map;
    module.ReloadServerList();
    break;
  case "filter_location":
    module.filter.filters.location = k.location_id;
    module.ReloadServerList();
    break;
  case "filter_gametype":
    module.filter.filters.game_type = k.game_type;
    module.ReloadServerList();
    break;
  case "filter_none":
    break;
  default:
    break;
  }
}

qlnabServerListView.prototype.SetupContextMenu = function(d, e) {
  var Q = {
    menu: "serverContext",
    inSpeed: 0,
    outSpeed: 0
  };
  e.data("info", {public_id: d.public_id, map: d.map, location_id: d.location_id, game_type: d.game_type});
  e.contextMenu(Q, this.MatchContextMenuHandler);
}


/**
 * Set up the prototype for launch game parameters, which is used
 * in ql_alt_parameters() and ql_alt_demo()
 */
function qlnabLaunchGameParams(a) {
  a = $.extend({password: null, isTraining: false}, a);
  var isStandard = quakelive.siteConfig.premiumStatus == "standard";
  var canShow = quakelive.config("forceVideoAds", false)
      || isStandard && quakelive.userstatus == "ACTIVE" && !a.isTraining;
  this.password = a.password;
  this.noInputGrab = !quakelive.IsLinux() && canShow;
  this.noAudio = canShow;
  this.noAds = !isStandard;
  this.shrinkViewport = isStandard;
  this.hasFullscreen = quakelive.cvars.GetIntegerValue("r_fullscreen", 0) != 0;
  this.browserMode = quakelive.cvars.GetIntegerValue("r_inbrowsermode", 12);
  this.cmdStrings = [];
}

qlnabLaunchGameParams.prototype.Append = function(a) {
  this.cmdStrings.push(a);
}

qlnabLaunchGameParams.prototype.Prepend = function(a) {
  this.cmdStrings.shift(a);
}

qlnabLaunchGameParams.prototype.GetCommandLine = function() {
  var a = quakelive.cvars.Get("model");
  quakelive.cvars.Set("headmodel", a.value);
  quakelive.cvars.Set("team_model", a.value);
  quakelive.cvars.Set("team_headmodel", a.value);
  quakelive.cfgUpdater.StoreConfig(quakelive.cfgUpdater.CFG_BIT_REP);
  a = "";
  if (this.noInputGrab) a += "+set in_nograb 1 ";
  if (this.noAudio) a += "+set s_volume 0 ";
  if (this.noAds) a += "+set g_advertDelay 0 ";
  a += "+set r_fullscreen " + quakelive.cvars.GetIntegerValue("r_fullscreen", 0) + " ";
  if (this.shrinkViewport) a += "+set r_inbrowsermode 0; +set vid_xpos 0; +set vid_ypos 0; ";
  a += '+set gt_user "' + pluginx.username + '" ';
  a += '+set gt_pass "' + pluginx.password + '" ';
  a += '+set gt_realm "' + quakelive.siteConfig.realm + '" ';
  if (typeof this.password == "string") a += '+set password "' + this.password + '" ';
  a += this.cmdStrings.join(" ");
  return a;
}


/**
 * Override mod_home's ShowContent to change the view type
 */
quakelive.mod_home.ShowContent = function(v) {
  if (quakelive.IsLoggedIn() && quakelive.userstatus != "ACTIVE") {
      quakelive.Goto("welcome");
  }
  else {
    quakelive.ShowContent(v);
    if (quakelive.IsLoggedIn()) {
      quakelive.MakeHomeChooser("home");
      v = new qlnabServerListView;
      v.SetDisplayProps({
          target: "ql_alt_browser tbody"
      });

      $(".postlogin_nav ul li:last")
          .after("<li id='ql_alt_parameters'>Parameters</li>" +
                 "<li id='ql_alt_filters'>Filters</li>" +
                 "<li id='ql_alt_demo'>Demo</li>" +
                 "<li id='ql_alt_refresh'>Refresh</li>");

      // Set up custom game parameters
      $("#ql_alt_parameters").click(function ql_alt_parameters() {
        qlPrompt({
          title: "Parameters",
          body: "Enter custom parameters to start QL (e.g. +exec mycfg.cfg +devmap campgrounds).",
          input: true,
          inputLabel: localStorage.getItem("ql_alt_parameters"),
          inputReadOnly: false,
          alert: false,
          ok: function() {
            var params = $("#modal-input > input").val();
            localStorage.setItem("ql_alt_parameters", params);
            $("#prompt").jqmHide();
            if (params) {
              var k = new qlnabLaunchGameParams;
              k.Append(params);
              LaunchGame(k);
            }
          }
        });
        return false;
      });

      // Set up server filtering
      $("#ql_alt_filters").click(function ql_alt_filters() {
        var tmp_exclude = localStorage.getItem("ql_alt_filters_exclude"),
            tmp_include = localStorage.getItem("ql_alt_filters_include"),
            content = "Enter items to include or exclude separated by commas.  Possible values:" +
                      "<ul><li><b>Location:</b> \"New York\" or \"Warsaw #2\"</li>" +
                      "<li><b>Map name:</b> \"Campgrounds\"</li>" +
                      "<li><b>Game mode:</b> \"ffa\"</li>" +
                      "<li><b>Server size:</b> \"/16\"</li>" +
                      "<li><b>Keywords:</b> \"qlnab.open\" (playable slots available), \"mods\" (modified rules)</li>" +
                      "<li><b>Combination:</b> \"New York + Campgrounds, Warsaw #2 + qlnab.open, ffa, /16\"</li></ul>" +
                      "<label for='ql_alt_filters_include'>Include:</label>&nbsp; <input type='text' id='ql_alt_filters_include'/> <br />" +
                      "<label for='ql_alt_filters_exclude'>Exclude:</label> <input type='text' id='ql_alt_filters_exclude' /> <br />";

        qlPrompt({
          customWidth: 600,
          title: "Filters",
          body: content,
          input: true,
          inputReadOnly: false,
          alert: false,
          ok: function() {
            var filters_exclude = $("#ql_alt_filters_exclude").val(),
                filters_include = $("#ql_alt_filters_include").val();

            $("#prompt").jqmHide();

            localStorage.setItem("ql_alt_filters_exclude", filters_exclude.toLowerCase());
            localStorage.setItem("ql_alt_filters_include", filters_include.toLowerCase());

            if (tmp_exclude != filters_exclude || tmp_include != filters_include) {
              (filters_exclude || filters_include) ? $("#ql_alt_filters").addClass("filter_enabled") : $("#ql_alt_filters").removeClass("filter_enabled");
              quakelive.serverManager.FlushCache();
              quakelive.mod_home.ReloadServerList();
            }
          }
        });

        $("#prompt td").attr("align", "left");
        $("#modal-input").css("display", "none");
        $("#ql_alt_filters_exclude").val(tmp_exclude);
        $("#ql_alt_filters_include").val(tmp_include);

        return false;
      }).toggleClass("filter_enabled", !!(localStorage.getItem("ql_alt_filters_exclude") || localStorage.getItem("ql_alt_filters_include")));

      // Set up demo launching
      $("#ql_alt_demo").click(function ql_alt_demo() {
        qlPrompt({
          title: "Demo",
          body: "Enter a demo name to play.  \"demo.cfg\" will automatically be executed, if it exists.",
          input: true,
          inputLabel: localStorage.getItem("ql_alt_demo"),
          inputReadOnly: false,
          alert: false,
          ok: function() {
            var demo = $("#modal-input > input").val();
            $("#prompt").jqmHide();
            localStorage.setItem("ql_alt_demo", demo);
            if (demo) {
              var k = new qlnabLaunchGameParams;
              k.Append("+exec demo.cfg +demo \"" + demo + "\"");
              LaunchGame(k);
            }
          }
        });
        return false;
      });

      // Set up list refreshing
      $("#ql_alt_refresh").click(function() {
        quakelive.serverManager.FlushCache();
        quakelive.mod_home.ReloadServerList();
      }).attr("title", "Shift + R");

      $("#qlv_postlogin_matches").append("<table border='0' id='ql_alt_browser'>" +
                                         "<tbody></tbody>" +
                                         "<thead><tr>" +
                                         "<th>&nbsp;</th>" +
                                         "<th>Location</th>" +
                                         "<th>Mode&nbsp;</th>" +
                                         "<th>Map</th>" +
                                         "<th>Skill</th>" +
                                         "<th>Players</th>" +
                                         "</tr></thead>" +
                                         "</table>");

      $("#ql_alt_browser").find("tbody")
                          // Dummy row for tablesorter to inspect
                          .append("<tr><td><img class='alocation_flag' src='a.gif' /></td>" +
                                  "<td class='alocation_text'>a</td><td><img src='a.gif' class='agameicon' /></td>" +
                                  "<td><span class='amapname'>campgrounds</span><span class='agamelabel'>a</span></td>" +
                                  "<td><img src='#' class='agamerank' /><a href='#' class='link share_link_img'></a></td>" +
                                  "<td class='aplayers'>0/128</td></tr>")
                          .end()
                          .tablesorter({debug: false,
                                        sortList: JSON.parse(localStorage.getItem("ql_alt_browser_sort")) || [[5,1]],
                                        headers: {4: {"sorter": "rank"}, 5: {"sorter": "players"}},
                                        widgets: ["zebra","sortPersist"]})
                          .bind("sortEnd", function(){ $(".contextMenu").destroyContextMenu().hide(); quakelive.HideTooltip(); })
                          .find("tbody")
                          .empty();

      quakelive.serverManager.listener = v;
      quakelive.params.showgamesettings && quakelive.mod_prefs.ShowOverlay();
      quakelive.mod_home.InitFilters();
      quakelive.mod_home.ReloadServerList();
      quakelive.mod_home.LoadQuickStats();
    }
    // User is not logged in... show the pretty pictures.
    else {
      var q = $("#home_carousel");
      if (q.length > 0) {
        for (var c = q.find("li").length, v = [], r = [], A = 0; A < c; ++A) {
          v.push(".carousel_item_" + A);
          r.push("<span class='carousel_nav_item carousel_item_" + A +
              (A == 0 ? " carousel_nav_selitem" : "") + '">' + (A + 1) + "</span>");
        }
        r.push("<div class='cl'><div>");
        $("#home_carousel_nav .inner").html(r.join(""));
        q.jCarouselLite({
          auto: 15E3,
          speed: 500,
          visible: 1,
          circluar: true,
          btnGo: v,
          afterEnd: function(G, H) {
            var E = (H - 1) % c;
            $(".carousel_nav_selitem").removeClass("carousel_nav_selitem");
            $(".carousel_item_" + E).addClass("carousel_nav_selitem")
          },
          beforeStart: function() {}
        })
      }
    }
  }
}


/**
 * Override matchtip's BindMatchTooltip to use hoverIntent
 */
quakelive.matchtip.BindMatchTooltip = function(b, k, e) {
  e = $.extend({ 
    onHover: null,
    onHoverOff: null,
    onClick: null,
    onDblClick: null,
    targetContext: null
  }, e);

  this.target = e.target;

  b.unbind("hover");
  b.unbind("click");
  b.unbind("dblclick");

  e.node = b;
  e.public_id = k;
  var g = this;

  b.click(function() {
    e.onClick && e.onClick(b, k);
    if (e.targetContext) g.activeContext = e.targetContext;
    g.OnClickMatchTooltip(b, k, e);
    return false
  });

  b.dblclick(function() {
    e.onDblClick && e.onDblClick(b, k);
    if (e.targetContext) g.activeContext = e.targetContext;
    return g.OnDblClickMatchTooltip(b, k)
  });

  b.hoverIntent(function() {
    if (!(g.pinnedServer && k == g.pinnedServer.public_id
        && (g.hoverNode == null || b == g.hoverNode))) {
      e.onHover && e.onHover(b, k);
      if (e.targetContext) g.activeContext = e.targetContext;
      g.UnPinMatchTooltip();
      g.OnHoverMatchTooltip(b, k, e.cachedServerIds)
    }
  }, function() {
    if (!g.pinnedServer) {
      e.onHoverOff && e.onHoverOff(b, k);
      g.HideMatchTooltip(k);
      g.activeContext = null
    }
  })
}
}); // end of call to contentEval


/**
 * Override matchtip's PinMatchTooltip to avoid pinning if the tip is hidden
 */
contentEval(function() {
var oldPinMatchTooltip = quakelive.matchtip.PinMatchTooltip;
quakelive.matchtip.PinMatchTooltip = function() {
  var tipOffset = $("#lgi_tip").offset();
  if (!(tipOffset.left || tipOffset.top)) {
    return;
  }
  oldPinMatchTooltip.apply(quakelive.matchtip, arguments);
}
}); // end of call to contentEval


/**
 * Override matchtip's GetTooltipOffset and DisplayMatchPlayers to display
 * match list tips to the right, friends list tips to the left
 */
contentEval(function() {
quakelive.matchtip.GetTooltipOffset = function(e, g, k) {
  var d = e;
  var l = {};
  var n = {
    left: $(document).scrollLeft(),
    top: $(document).scrollTop(),
    right: $(document).scrollLeft() + $("body").width(),
    bottom: $(document).scrollTop() + $("body").height(),
    width: $("body").width(),
    height: $("body").height()
  };
  var u = 23, B = 2, x = 120, p = 28, z = 28;
  var q = {
    width: g.innerWidth(),
    height: g.innerHeight()
  };

  e = quakelive.matchtip.GetDimensions(e);
  e = {
    left: e.left,
    top: e.top,
    right: e.left + e.innerWidth,
    bottom: e.top + e.innerHeight,
    width: e.innerWidth,
    height: e.innerHeight
  };

  if (!/^match_\d+$/.test(d.attr("id"))) {
    l.left = e.left - q.width - u + 4;
    l.arrowDirection = "right";
    l.arrowLeft = e.left - u;
    g.orientation = "left";
    g.addClass("lefto")
  }
  else {
    l.left = e.left + e.width + u;
    l.arrowDirection = "left";
    l.arrowLeft = e.right + B;
    g.orientation = "right";
    g.removeClass("lefto")
  }

  l.arrowTop = e.top + e.height / 2 - x / 2;

  if (l.arrowTop < n.top) {
    g = n.top - l.arrowTop;
    if (g > e.height / 2) g = e.height / 2;
    l.arrowTop += g
  }

  l.top = l.arrowTop - (q.height - p - z) / 3;
  if (l.top + q.height > n.bottom)
    l.top -= l.top + q.height - n.bottom;
  l.arrowLeft -= l.left;
  l.arrowTop = l.arrowTop - l.top - p;
  return l;
}


quakelive.matchtip.DisplayMatchPlayers = function(e) {
  var d = {
    Free: 0,
    Red: 1,
    Blue: 2,
    Spec: 3
  };
  var g = $("#lgi_tip"), k = $("#lgi_cli");

  // Avoid showing player list (lgi_cli) if the tip is off-screen
  var gOff = g.offset();
  if (!gOff.left && !gOff.top) return;

  if (k.length == 0) {
      k = $("<div id='lgi_cli'><div id='lgi_cli_top'><div class='lgi_headcol_1'>Player Name</div><div class='lgi_headcol_2'>Score</div></div><div id='lgi_cli_fill'><div id='lgi_cli_content'></div></div><div id='lgi_cli_bot'></div></div>");
      k.appendTo("body")
  }
  var l = k.find("#lgi_cli_content");
  l.empty();

  if (e.players.length > 0) for (var n = 0; n < e.players.length; ++n) {
    var q = e.players[n], u, B, x, p, z;
    p = n % 2 == 0 ? "lgi_med lgi_cli_row_1" : "lgi_med lgi_cli_row_2";

    if (q.friend) {
      p += " lgi_is_friend";
    }
    else if (q.blocked) {
      p += " lgi_is_blocked";
    }

    u = q.clan ? StripColors(q.clan) + " " : "";
    B = StripColors(q.name);
    u += B;

    if (q.bot) {
      u += " <i>(Bot)</i>";
      p += " lgi_is_bot"
    }

    x = q.team == d.Spec ? "SPEC" : 2 == e.game_type ? FormatRaceDuration(q.score) : q.score;

    if (q.model) {
      var K = q.model.toLowerCase().split("/");
      z = K[0] + "_";
      z += K[1] ? K[1] : "default"
    }
    else {
      z = "sarge_default";
    }

    if (q.team == d.Red) {
      z = ChangeModelSkin(z, "red");
    }
    else if (q.team == d.Blue) {
      z = ChangeModelSkin(z, "blue");
    }

    K = "<a href='javascript:;' onclick='quakelive.Goto(\"profile/summary/" + StripColors(q.name) + "\"); return false'>";
    B = quakelive.mod_friends.IsBlocked(B) ? "<img src='" + quakelive.resource("/images/players/icon_gray_sm/" + z + ".png") + "' class='lgi_bordercolor_" + q.team + "' width='18' height='18' />" : "<img src='" + quakelive.resource("/images/players/icon_sm/" + z + ".png") + "' class='lgi_bordercolor_" + q.team + "' width='18' height='18' />";
    u = u;

    if (!q.bot) {
      B = K + B + "</a>";
      u = K + u + "</a>"
    }

    l.append("<div class='" + p + "'><div class='lgi_cli_col_1'>" + B + "<span>" + u + "</span><div class='cl'></div></div><div class='lgi_cli_col_2'>" + x + "</div></div>")
  }
  else {
    l.append("<center>No Players in Game</center>");
  }

  e = quakelive.matchtip.GetDimensions(g);
  e = {
    left: e.left,
    top: e.top,
    right: e.left + e.innerWidth,
    bottom: e.top + e.innerHeight,
    width: e.innerWidth,
    height: e.innerHeight
  };
  l = {
    width: 236
  };

  if (g.hasClass("lefto")) {
    l.left = e.left - k.width() + 8;
  }
  else {
    l.left = e.right
  }
  l.top = e.top;
  k.css("left", l.left + "px");
  k.css("top", l.top + "px");
  k.show();
}


/**
 * Create keyboard shortcuts
 */
$(document).keypress(function(e) {
  if (e.which == 82 && quakelive.activeModule.TITLE == "Home") {
    // shift+R on the home page
    quakelive.serverManager.FlushCache();
    quakelive.mod_home.ReloadServerList();
  }
});
}); // end of call to contentEval
