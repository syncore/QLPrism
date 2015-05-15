// ==UserScript==
// @name            QL Gametype Switcher
// @version         1.6
// @include         http://*.quakelive.com/*
// @exclude         http://*.quakelive.com/forum*
// @description     Script that makes QuakeLive navigation between game types faster and user friendly.
// @author          aiken
// @updateURL       https://userscripts.org/scripts/source/120117.meta.js
// ==/UserScript==

// Set up some stuff for user script updating
var SCRIPT_NAME = "QL Gametype Switcher"
  , SCRIPT_VER  = "1.6";
GM_updatingEnabled = "GM_updatingEnabled" in window ? GM_updatingEnabled : false;

/**
 * Don't bother if Quake Live is down for maintenance or we're not the top frame
 * Note: Copied from wn's QL New Alt Browser script: http://userscripts.org/scripts/show/73076
 */
if (new RegExp("offline", "i").test(document.title)
    || unsafeWindow.self != unsafeWindow.top)
  return;

// Script initializing function
function QL_GTS_Init(unsafeWindow) {

    /**
     * GM_ API emulation for Chrome
     * 2009, 2010 James Campos
     * cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
     */
    if (typeof GM_getValue == "undefined") {
      GM_getValue = function(name, defaultValue) {
        var value = localStorage.getItem(name);
        if (!value)
          return defaultValue;
        var type = value[0];
        value = value.substring(1);
        switch (type) {
          case 'b':
            return value == 'true';
          case 'n':
            return Number(value);
          default:
            return value;
        }
      }
      GM_setValue = function(name, value) {
        value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
      }
      GM_registerMenuCommand = function() {};


    };
    if (typeof GM_addStyle == "undefined") {
      GM_addStyle = function(css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    }

    // Variables from Quake Live site that will be accessed
    var $ = unsafeWindow.jQuery;
    var quakelive = unsafeWindow.quakelive;
    var qlPrompt = unsafeWindow.qlPrompt;

    // Add style classes used in the script
    GM_addStyle("a.qfLink {color: black; text-decoration: none; white-space: nowrap} "+
                "a.qfLink img { margin: 0 2px; vertical-align: middle; }"+
                "a.qfSvTypeLink {display: none; color: grey; font-size: 11px; font-weight: bold; text-decoration: none; margin-left:250px; margin-top: 4px; float: left;}"+
                "a.qfSvTypeLink:hover { text-decoration: underline; }"+
                "#quickFilter {margin-top: 8px; margin-left: 5px; padding: 2px; word-spacing: 3px; color: black; border-bottom: 1px solid grey; }");

    //window.addEventListener("message", QL_GTS_messageHandler, false);

    // Attach to QL function that initializes the whole page
    var oldHomeShowContent = quakelive.ShowContent;
    quakelive.ShowContent = function (v) {
        oldHomeShowContent(v);

        QL_GTS = {
            // Local internal variables
            MAX_GAMETYPE_NUM: 25, // used for validation
            ID: 0,
            IMAGE: 1,
            NAME: 2,
            TITLE: 3,
            // Defined game types (used fields are: gametype number, icon name from QL repository, displayed text, title hint)
            GAME_TYPES: [   [2,  'ffa',  'FFA', 'Free For All'],
                            [4,  'ca',   'CA', 'Clan Arena'],
                            [7,  'duel', 'Duel', 'One On One'],
                            [6,  'tdm',  'TDM', 'Team Deathmatch'],
                            [3,  'ctf',  'CTF', 'Capture The Flag'],
                            [5,  'ft',   'FT', 'Freeze Tag'],
                            [1,  'tdm',  'Team', 'Any Team Game (CTF, CA, FT, TDM)'],

							[16, 'fctf', '1CTF', '1-Flag CTF'],
							[18, 'ad',   'A&D', 'Attack & Defend'],
							[15, 'dom',  'DOM', 'Domination'],
							[17, 'harvester', 'HAR', 'Harvester'],
							[19, 'rr',   'RR', 'Red Rover'],

                            [8,  'ffa',  'iFFA', 'Instagib Free For All'],
                            [14, 'ca',   'iCA',  'Insta CA'],
                            [11, 'tdm',  'iTDM', 'Instagib Team Deathmatch'],
                            [9,  'ctf',  'iCTF', 'Instagib Capture The Flag'],
                            [10, 'ft',   'iFT', 'Instagib Freeze Tag'],
							[21, 'fctf', 'i1CTF', 'Insta 1-Flag CTF'],
							[23, 'ad',   'iA&D', 'Insta Attack & Defend'],
							[20, 'dom',  'iDOM', 'Insta Domination'],
							[22, 'harvester', 'iHAR', 'Insta Harvester'],
							[24, 'rr',   'iRR', 'Insta Red Rover'],
                            [25, 'race',  'RACE', 'Race'],

                            [12, 'tdm',  'Ranked', 'Any Ranked Game'],
							[13, 'tdm',  'Unranked', 'Any Unranked Game'],
                            [0,  'tdm',  'All', 'All Game Types'],
						],

            browserInitialHeight: 0,

            // Helper function to check if game type is enabled in game type bitmap variable
            isGameTypeEnabled: function (bitmap, gameTypeNum) {
                return (bitmap & (1 << gameTypeNum)) > 0;
            },
            // Fills quick filter bar with available game type links
            fillModesBar: function () {
                var filtersBitmap = localStorage.getItem("ql_gts_filters_bitmap", 0xFFFFFFFF);
                var quickFilterContent = "";
                // Dynamically create links
                for (var i in QL_GTS.GAME_TYPES) {
                    // Check if this game type is enabled in the settings
                    if (QL_GTS.isGameTypeEnabled(filtersBitmap, QL_GTS.GAME_TYPES[i][QL_GTS.ID])) {
                        quickFilterContent += '<a id="'+QL_GTS.GAME_TYPES[i][QL_GTS.ID]+'" title="'+QL_GTS.GAME_TYPES[i][3]+'" class="qfLink" href="javascript:;"><img src='+quakelive.resource('/images/gametypes/xsm/'+QL_GTS.GAME_TYPES[i][QL_GTS.IMAGE]+'.png')+' />'+QL_GTS.GAME_TYPES[i][QL_GTS.NAME]+'</a> ';
                    }
                }

                // Replace content of quick filter bar
                $('#quickFilterGTList').html(quickFilterContent);

                // Attach action for game type links
                $('.qfLink').click(function() {
                    $("#ctrl_filter_gametype").val(this.id).attr("selected", "selected");
                    $("#ctrl_filter_gametype").change();
                    quakelive.mod_home.SaveBrowserFilter();
                });
                return false;
            },

            // Function that display QL Prompt asking for users customization settings
            configureFilters: function () {
                var filtersBitmap = localStorage.getItem("ql_gts_filters_bitmap", 0xFFFFFFFF);
                var promptContent = 'Select game modes that you want to display on the quick filter bar:<br /><br />';

                for (var i in QL_GTS.GAME_TYPES) {
                    var chboxIdentifier = 'ql_gts_chb_'+QL_GTS.GAME_TYPES[i][QL_GTS.ID];
                    var checkedAttr = QL_GTS.isGameTypeEnabled(filtersBitmap, QL_GTS.GAME_TYPES[i][QL_GTS.ID]) ? 'checked="checked"' : '';
                    promptContent += '<span style="display: inline-block;"><input type="checkbox" id="'+chboxIdentifier+'" value="'+QL_GTS.GAME_TYPES[i][QL_GTS.ID]+'" '+checkedAttr+' /> <label for="'+chboxIdentifier+'"><img src='+quakelive.resource('/images/gametypes/xsm/'+QL_GTS.GAME_TYPES[i][QL_GTS.IMAGE]+'.png')+' />'+QL_GTS.GAME_TYPES[i][QL_GTS.NAME]+'</label></span>&nbsp;&nbsp;&nbsp;';
                }
                promptContent += "<br /><br /><a id='ql_gts_selectAll' href='javascript:;'>Select All</a> | <a id='ql_gts_selectNone' href='javascript:;'>Select None</a><br />";

                qlPrompt({
                    customWidth: 850,
                    title: "Customize Quick Game Type Filter",
                    body: promptContent,
                    input: false,
                    inputReadOnly: false,
                    alert: false,
                    ok: function () {
                            // Assume empty bitmap like nothing is selected
                            var filtersBitmap = 0;
                            $('#prompt input:checkbox:checked').each(function(i) {
                                var gameTypeNum = parseInt(this.value);
                                if (gameTypeNum >= 0 && gameTypeNum <= QL_GTS.MAX_GAMETYPE_NUM) {
                                    // Set 1 on the bit number equal to game type number
                                    filtersBitmap |= 1 << gameTypeNum;
                                }
                            });
                            $("#prompt").jqmHide();

                            // Save bitmap in local storage for future
                            localStorage.setItem("ql_gts_filters_bitmap", filtersBitmap);

                            // Refresh game modes list on the quick filter bar
                            QL_GTS.fillModesBar();
                            QL_GTS.ajdustServerBrowserHeight();
                        }
                });

                // Attach actions to Select All and Select None links on the customization pop-up
                $('#ql_gts_selectAll').click(function () {
                    $('#prompt input:checkbox').attr('checked', true);
                });
                $('#ql_gts_selectNone').click(function () {
                    $('#prompt input:checkbox').attr('checked', false);
                });

                return false;
            },

            ajdustServerBrowserHeight: function () {
                if (QL_GTS.browserInitialHeight == 0) {
                    QL_GTS.browserInitialHeight = $('#qlv_postlogin_matches').height();
                }
                var divHeight = $('#quickFilter').height() + 7;
                $('#qlv_postlogin_matches').css('margin-top', divHeight);
                $('#qlv_postlogin_matches').css('height', QL_GTS.browserInitialHeight - divHeight + 'px');
            },

            // Function that is called to initialize QL_GTS
            initialize: function() {
                // Attach action to customize button that opens settings pop-up
                $('#qfCustomize').click(QL_GTS.configureFilters);

                // Fill game modes list on the quick filter bar
                QL_GTS.fillModesBar();
            }
        }

        // Add private and public matches quick switch (both are not displayed by default)
        $('#matchlist_header').prepend('<a id="qfSvShowPrivate" class="qfSvTypeLink" href="javascript:;" >Private Matches</a>'+
                                       '<a id="qfSvShowPublic" class="qfSvTypeLink" href="javascript:;" >Public Matches</a>');
        // Add space with quick filter above the server list
        $('#matchlist_header').append('<div id="quickFilter"> \
            <b>Mode:</b> <span id="quickFilterGTList"></span>'+
            '<span style="float: right; margin: 0 2px;"><a href="javascript:;" id="qfCustomize"><img title="Customize Quick Filter" src='+quakelive.resource('/images/modules/clans/ranks/rank_1.png')+' /></a></span>'+
            '</div>');

        // Attach action to link that changes server type to private
        $('#qfSvShowPrivate').click(function() {
            $("input:radio[name=private][value=1]").trigger('click');
            $("input:radio[name=private][value=1]").trigger('click'); // need two clicks to trigger action, dunno why
            quakelive.mod_home.SaveBrowserFilter();
        });
        // Attach action to link that changes server type to public
        $('#qfSvShowPublic').click(function() {
            $("input:radio[name=private][value=0]").trigger('click');
            $("input:radio[name=private][value=0]").trigger('click'); // need two clicks to trigger action, dunno why
            quakelive.mod_home.SaveBrowserFilter();
        });

        QL_GTS.initialize();
        QL_GTS.ajdustServerBrowserHeight();

    };

    // Wrap around save browser settings success function to disable toggling of customize bar
    var oldSaveSuccess = quakelive.mod_home.SaveBrowserFilter_Success;
    quakelive.mod_home.SaveBrowserFilter_Success = function() {
        // Save handle to old toggle function and replace with empty one
        var tmpToggleFunc = quakelive.mod_home.ToggleFilterBar;
        quakelive.mod_home.ToggleFilterBar = function () {};
        oldSaveSuccess();
        // Restore normal toggle function
        quakelive.mod_home.ToggleFilterBar = tmpToggleFunc;
    };

    // Wrap around refresh filter UI function to show proper action of switching between server types
    var oldRefreshFilter = quakelive.mod_home.UI_RefreshFilter;
    quakelive.mod_home.UI_RefreshFilter = function() {
        // This function is called internally by QL so we can listen to match type changes
        oldRefreshFilter();
        var mlHeaderClassName = $("#matchlist_header").attr("class");
        if ("matchlist_header_public" == mlHeaderClassName) {
            $('#qfSvShowPublic').css('display', 'none');
            $('#qfSvShowPrivate').css('display', 'inline');
        } else {
            $('#qfSvShowPublic').css('display', 'inline');
            $('#qfSvShowPrivate').css('display', 'none');
        }
    };
}

/**
 * Use an auto-update script if integrated updating isn't enabled
 * Based on http://userscripts.org/scripts/show/38017
 * and http://userscripts.org/scripts/show/114449
 * NOTE from 2nd author: Modified to remove some checks, since we do that above.
 *       Also added the new version number to the upgrade prompt
 *       and custom messages for Chrome users (requires a manual update).
 */
if (!GM_updatingEnabled && "undefined" != typeof(GM_xmlhttpRequest)) {
  var AutoUpdater_120117={id:120117,days:1,name:SCRIPT_NAME,version:SCRIPT_VER,time:new Date().getTime(),call:function(response,secure){GM_xmlhttpRequest({method:"GET",url:"http"+(secure?"s":"")+"://userscripts.org/scripts/source/"+this.id+".meta.js",onload:function(xpr){AutoUpdater_120117.compare(xpr,response)},onerror:function(xpr){if(secure){AutoUpdater_120117.call(response,false)}}})},enable:function(){GM_registerMenuCommand(this.name+": Enable updates",function(){GM_setValue("updated_120117",new Date().getTime()+"");AutoUpdater_120117.call(true,true)})},compareVersion:function(r_version,l_version){var r_parts=r_version.split("."),l_parts=l_version.split("."),r_len=r_parts.length,l_len=l_parts.length,r=l=0;for(var i=0,len=(r_len>l_len?r_len:l_len);i<len&&r==l;++i){r=+(r_parts[i]||"0");l=+(l_parts[i]||"0")}return(r!==l)?r>l:false},compare:function(xpr,response){this.xversion=/\/\/\s*@version\s+(.+)\s*\n/i.exec(xpr.responseText);this.xname=/\/\/\s*@name\s+(.+)\s*\n/i.exec(xpr.responseText);if((this.xversion)&&(this.xname[1]==this.name)){this.xversion=this.xversion[1];this.xname=this.xname[1]}else{if((xpr.responseText.match("the page you requested doesn't exist"))||(this.xname[1]!=this.name)){GM_setValue("updated_120117","off")}return false}var updated=this.compareVersion(this.xversion,this.version);if(updated&&confirm("A new version of "+this.xname+" is available.\nDo you wish to install the latest version ("+this.xversion+")?")){var path="http://userscripts.org/scripts/source/"+this.id+".user.js";if(window.chrome){prompt("This script can't be updated automatically in Chrome.\nPlease uninstall the old version, and navigate to the URL provided below.",path)}else{try{window.parent.location.href=path}catch(e){}}}else{if(this.xversion&&updated){if(confirm("Do you want to turn off auto updating for this script?")){GM_setValue("updated_120117","off");this.enable();if(window.chrome){alert("You will need to reinstall this script to enable auto-updating.")}else{alert("Automatic updates can be re-enabled for this script from the User Script Commands submenu.")}}}else{if(response){alert("No updates available for "+this.name)}}}},check:function(){if(GM_getValue("updated_120117",0)=="off"){this.enable()}else{if(+this.time>(+GM_getValue("updated_120117",0)+1000*60*60*24*this.days)){GM_setValue("updated_120117",this.time+"");this.call(false,true)}GM_registerMenuCommand(this.name+": Check for updates",function(){GM_setValue("updated_120117",new Date().getTime()+"");AutoUpdater_120117.call(true,true)})}}};AutoUpdater_120117.check();
}

//if (new RegExp('Firefox/\\d', 'i').test(navigator.userAgent)) { // this detects QL Prism like Chrome, should rather like Firefox
if (!window.chrome) {
    //Firefox
    QL_GTS_Init(unsafeWindow);
} else {
    //Chrome
    var scriptNode = document.createElement("script");
    scriptNode.setAttribute("type", "text/javascript");
    scriptNode.text = "(" + QL_GTS_Init.toString() + ")(window);";
    document.body.appendChild(scriptNode);
}
