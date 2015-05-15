scr_meta=<><![CDATA[
// ==UserScript==
// @id             reorg@qlprism.us
// @name           Reorganize QuakeLive
// @namespace      http://www.quakelive.com/*
// @include        http://*.quakelive.com/* 
// @homepage       http://www.qlprism.us
// @version        0.21
// @author         syncore
// @updateURL      http://www.qlprism.us/scripts/source/reorganize_quakelive.meta.js
// ==/UserScript==
]]></>.toString();

GM_addStyle('#spon_vert{display:none !important;} #qlv_topFadeAds{display:none;} .spon_media{display:none;}');
//GM_addStyle('#im-body{height:auto !important;}');
//GM_addStyle('.personal_stats{display:none;} .twocol_left{min-height: 0px;} .thirtypxhigh{display:none;}');
GM_addStyle('#qlv_footer2{display:none;}');

// check for updates
var AnotherAutoUpdater = {
 identi: 'reorganize_quakelive', 
 days: 0, // Days to wait between update checks

 name: /\/\/\s*@name\s+(.*)\s*\n/i.exec(scr_meta)[1],
 version: /\/\/\s*@version\s+(.*)\s*\n/i.exec(scr_meta)[1].replace(/\./g, ''),
 time: new Date().getTime(),
 call: function(response) {
    GM_xmlhttpRequest({
      method: 'GET',
	  url: 'http://www.qlprism.us/scripts/source/'+this.identi+'.meta.js',
	  onload: function(xpr) {AnotherAutoUpdater.compare(xpr,response);}
      });
  },
 compare: function(xpr,response) {
    this.xversion=/\/\/\s*@version\s+(.*)\s*\n/i.exec(xpr.responseText);
    this.xname=/\/\/\s*@name\s+(.*)\s*\n/i.exec(xpr.responseText);
    if ( (this.xversion) && (this.xname[1] == this.name) ) {
      this.xversion = this.xversion[1].replace(/\./g, '');
      this.xname = this.xname[1];
    } else {
      if ( (xpr.responseText.match("the page you requested doesn't exist")) || (this.xname[1] != this.name) ) 
	GM_setValue('updated_'+this.identi, 'off');
      return false;
    }
    if ( (+this.xversion > +this.version) && (confirm('A new version of the '+this.xname+' user script is available. Do you want to update?')) ) {
      GM_setValue('updated_'+this.identi, this.time+'');
      //top.location.href = 'http://www.qlprism.us/scripts/source/'+this.identi+'.user.js';
      unsafeWindow.parent.location.href = 'http://www.qlprism.us/scripts/source/'+this.identi+'.user.js';
    } else if ( (this.xversion) && (+this.xversion > +this.version) ) {
      if(confirm('Update later?')) {
	GM_log("this does nothing");
	GM_registerMenuCommand("Auto Update "+this.name, function(){GM_setValue('updated_'+this.identi, new Date().getTime()+''); AnotherAutoUpdater.call(true);});
      } else {
	GM_setValue('updated_'+this.identi, this.time+'');
      }
    } else {
      if(response) alert('No updates available for '+this.name);
      GM_setValue('updated_'+this.identi, this.time+'');
    }
  },
  check: function() {
    if (GM_getValue('updated_'+this.identi, 0) == "off")
      GM_registerMenuCommand("Enable "+this.name+" updates", function(){GM_setValue('updated_'+this.identi, new Date().getTime()+'');AnotherAutoUpdater.call(true)});
    else {
      if (+this.time > (+GM_getValue('updated_'+this.identi, 0) + 1000*60*60*24*this.days)) {
        GM_setValue('updated_'+this.identi, this.time+'');
        this.call();
      }
      GM_registerMenuCommand("Check "+this.name+" for updates", function(){GM_setValue('updated_'+this.identi, new Date().getTime()+'');AnotherAutoUpdater.call(true)});
    }
  }
};
AnotherAutoUpdater.check();


