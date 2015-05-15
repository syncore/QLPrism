/*!
 * QUAKE LIVE Demo Player (QLDP)
 * 2009-09-03
 *
 * Copyright (C) Andrée Hansson
 * http://andreehansson.se/projects/
 *
 * Licensed under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/*jslint browser: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, newcap: true */
var QLDP = {

	// Cache and local variables
	$: undefined,
	doc: undefined,
	win: undefined,
	dQueue: [],
	totalDemos: 0,
	demoList: {},
	fromOldPl: [],
	sortList: [],

	// Index, filter text
	filter: [0, ""/*type*/, ""/*players*/, ""/*map*/, ""/*date*/],

	// Index, asc/descending
	lastSort: [0, 1],
	// Current page, last page, items per page
	pages: [1, 1, 20],
	isStarted: false,
	layoutCache: '',

	directory: {
		nsIObj: undefined,
		overridePath: '',
		lastModified: 0,
		searchInterval: 5,
		pathSeperator: "\\"
	}
};

/**
 * Self-invoking function that'll output debug messages when the console is
 * activated. It'll print everything stored in the dQueue array and empty it.
 */
(function () {
	var win = QLDP.win, i;

	if (win && win.console && win.console.log) {

		for (i = 0; i < QLDP.dQueue.length; i++) {
			win.console.log.apply(win.console, QLDP.dQueue[i]);
			QLDP.dQueue.splice(i, 1);
		}
	}

	window.setTimeout(arguments.callee, 250);
})();

/**
 * debug(args)
 * A simple wrapper for the console.log Firebug command. It helps debugging the
 * script way more easily then any other method available. Just enable Firebug
 * console on the website and it'll start spitting out debug messages. The actual
 * printing is made in the self-invoking function above.
 */
QLDP.debug = function () {
	QLDP.dQueue.push(arguments);
}

/**
 * init(d, w)
 * Initiates QLDP by running the underlying functions before triggering 'run()'.
 * It will also set the core variables.
 * @param d The document object
 * @param w The window object
 */
QLDP.init = function (d, w) {
	// Set scope vars
	QLDP.doc = d;
	QLDP.win = w;
	QLDP.$ = window.$;
	QLDP.win.QLDP = QLDP;

	// Reset the debug queue
	QLDP.dQueue = [];
	QLDP.debug("[QLDP] Website loaded");

	// Needed for free search
	QLDP.$.extend(QLDP.$.expr[':'], { textval : "jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0" });

	QLDP.ioInit(function() {
		// Informative when debugging
		QLDP.debug("[QLDP] Chrome path:", QLDP.directory.chrome, " - Exists:", QLDP.fileExists(QLDP.directory.chrome));
		QLDP.debug("[QLDP] Demo path:", QLDP.directory.nsIObj.path, " - Exists:", QLDP.fileExists(QLDP.directory.nsIObj.path));

		QLDP.updateDemoCache();
		QLDP.checkForDemos();

		QLDP.run();		
	});
}

/**
 * extend(obj, withObj)
 * Extends an object with another object.
 * @param obj The object that should be extended
 * @param withObj The object which will extend the 'obj' object
 */
QLDP.extend = function (obj, withObj) {
	for (var i in withObj) {
		obj[i] = withObj[i];
	}

	return obj;
}
