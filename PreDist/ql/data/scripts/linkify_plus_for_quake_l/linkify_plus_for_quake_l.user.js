// ==UserScript==
// @name        Linkify Plus for Quake Live
// @version     1.1.9
// @author      kry
// @description	Turn plain text URLs into links and turn link into the color you want.  Works in Quake Live.
// @include     http://*.quakelive.com/*
// @exclude     http://*.quakelive.com/forum*
// ==/UserScript==

/*******************************************************************************

Linkifier Plus modified by kry. Licensed for unlimited modification
and redistribution as long as this notice is kept intact.

Only modified Linkify Plus to change the link color to red because
in Quake Live the links appeared in white with white background.
Everything else is written by Anthony Liuallen of http://arantius.com/

Also I have made minor bugfixes to make it work better in Quake Live.

Link to Linkify Plus
  http://userscripts.org/scripts/show/1352

** Linkify plus comments below
Loosely based on the Linkify script located at:
  http://downloads.mozdev.org/greasemonkey/linkify.user.js

Originally written by Anthony Lieuallen of http://arantius.com/
Licensed for unlimited modification and redistribution as long as
this notice is kept intact.

Using the Linkify Plus version 2.0.2. as a base.


Modified for QLPrism

*******************************************************************************/

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
  GM_addStyle = function(css) {
    var style = document.createElement('style');
    style.textContent = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  GM_registerMenuCommand = function() {}
}

var notInTags=[
	'a', 'head', 'noscript', 'option', 'script', 'style', 'title', 'textarea'
];
var textNodeXpath=
	".//text()[not(ancestor::"+notInTags.join(') and not(ancestor::')+")]";
var urlRE=/((?:https?|ftp):\/\/[^\s'"'<>]+|www\.[^\s'"'<>]+)/gi;
var urlREQ=/(^|["'(\s]|&lt;)((?:(qlprism):\/\/|mailto:).+?)((?:[:?]|\.+)?(?:\s|$)|&gt;|[)"',])/g;

var queue=[];

// Check variables if divs existed before
var haslistener = 0;
var hasbox = 0;

// Rainbow previous color
var rbcolor = 0;

// Number of messages currently on chat
var currentmessagecount = 0;
var currentmessage = 0;

// Colors
const colors = new Array("#FF0000");

// Color tags
const red = 0;

// When a new message has came, this function passes that message to linkifyContainer
function chatbodylistener()
{
	if ( document.getElementById("im-chat-body").childNodes[currentmessagecount].id != "im-chat-body-bottom" )
	{
		linkifyContainer(document.getElementById("im-chat-body").childNodes[currentmessagecount]);

		currentmessagecount++;
	}
	else
	{
		linkifyContainer(document.getElementById("im-chat-body").childNodes[currentmessagecount - 1]);
	}
}

/******************************************************************************/

if ('text/xml'!=document.contentType
	&& 'application/xml'!=document.contentType
) {
	document.body.addEventListener('DOMNodeInserted', function(event)
	{
		if ( document.getElementById("im-chat-body") )
		{
			if ( haslistener == 0 )
			{
				haslistener = 1;
				currentmessagecount = 0;
				currentmessage = 0;
				document.getElementById("im-chat-body").addEventListener('DOMSubtreeModified', chatbodylistener, false);
			}
		}
		else
		{
			haslistener = 0;
		}

		if ( document.getElementById("qlv_contentChat") )
		{
			if ( hasbox == 0 )
			{
				hasbox = 1;

				document.getElementById("qlv_contentChat").appendChild(coloroflink);
				//document.getElementById("qlv_contentChat").appendChild(dropdown);
				}
		}
		else
		{
			hasbox = 0;
		}

		if ( document.getElementById("qlv_profileTopLeft") )
			linkifyContainer(document.getElementById("qlv_profileTopLeft"));
	}, false);
}

/******************************************************************************/

function linkifyContainer(container) {
	var xpathResult=document.evaluate(
		textNodeXpath, container, null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
	);

	var i=0;
	function continuation() {
		var node, limit=0;
		while (node=xpathResult.snapshotItem(i++)) {
			linkifyTextNode(node);

			if (++limit>50) {
				return setTimeout(continuation, 0);
			}
		}
	}
	setTimeout(continuation, 0);
}

function linkifyTextNode(node) {
	var i, l, m;
	var txt=node.textContent;
	var span=null;
	var p=0;


    var linkcolor = red;
	while (m=urlRE.exec(txt)) {

		if (null==span) {
			//create a span to hold the new text with links in it
			span=document.createElement('span');
		}

		//get the link without trailing dots
		l=m[0].replace(/\.*$/, '');

        l=l.replace('/r/', '/#!');
		//put in text up to the link
		span.appendChild(document.createTextNode(txt.substring(p, m.index)));
		//create a link and put it in the span
		a=document.createElement('a');
		a.className='linkifyplus';
		a.appendChild(document.createTextNode(l));
		if (l.match(/^www/i)) {
			l='http://'+l;
		} else if (-1==l.indexOf('://')) {
			l='qlprism:'+l;
		}
		a.setAttribute('href', l);
		a.style.color = colors[linkcolor];
		if ( l.match(/^http:\/\/www\.quakelive\.com\/forum/i) || !( l.match(/^http:\/\/www\.quakelive\.com/i) || l.match(/^https:\/\/secure\.quakelive\.com/i) ) )
		{
			a.setAttribute('target', '_blank');
		}
		span.appendChild(a);
		//track insertion point
		p=m.index+m[0].length;
	}

	while (m=urlREQ.exec(txt)) {

		if (null==span) {
			//create a span to hold the new text with links in it
			span=document.createElement('span');
		}

		//get the link without trailing dots
		l=m[0].replace(/\.*$/, '');
        //l=l.replace('/r/', '/#!');

		span.appendChild(document.createTextNode(txt.substring(p, m.index)));

		a=document.createElement('a');
		a.className='linkifyplus';
		a.appendChild(document.createTextNode(l));
		if (l.match(/^qlprism/i)) {
			l="http://www.quakelive.com/#!join/"+l.replace("qlprism://#!join/","");
			//l=l;
		} else if (-1==l.indexOf('://')) {
			l='mailto:'+l;
		}
		a.setAttribute('href', l);
		a.style.color = colors[linkcolor];
		span.appendChild(a);
		p=m.index+m[0].length;
	}


	if (span) {
		//take the text after the last link
		span.appendChild(document.createTextNode(txt.substring(p, txt.length)));
		//replace the original text with the new span
		try {
			node.parentNode.replaceChild(span, node);
		} catch (e) {
			console.error(e);
			console.log(node);
		}
	}
}