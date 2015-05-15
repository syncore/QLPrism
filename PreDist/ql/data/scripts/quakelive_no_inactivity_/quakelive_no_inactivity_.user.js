// ==UserScript==
// @name           QuakeLive No Inactivity & Constant Chat Scrolled View
// @namespace      qlDontExpireAndChat
// @description    Stop QL from logging you out after inactivity & keep chat window scrolled to bottom after changing pages
// @include        http://*quakelive.com/*
// ==/UserScript==

qlWindow = unsafeWindow;
qlWindow.quakelive.PageRedirect = function (t) {
	if (t == "/user/logout/session_expired") {
		//donothing
	} else {
		window.location = t;
	}
};

