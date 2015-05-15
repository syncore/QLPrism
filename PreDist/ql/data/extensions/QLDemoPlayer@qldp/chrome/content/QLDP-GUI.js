/**
 * run()
 * Will initiate the injection of the actual GUI, position the elements and so
 * forth.
 */
QLDP.run = function () {
	var $ = QLDP.$, win = QLDP.win, $qldp = $('#qldp-menu-link', QLDP.doc);

	QLDP.style = "<style type=\"text/css\">" + QLDP.getFileContent("GUI.css") + '</style>';
	QLDP.html = QLDP.getFileContent("GUI.html");

	if ($('#qlv_userInfo .WelcomeText', QLDP.doc).get(0) && !$qldp.length) {
		// Set default parameters for the launcher, must be here since we're using the window
		QLDP.defaultLaunchParams = {
			"set gt_user": win.quakelive.username,
			"set gt_pass": win.quakelive.xaid,
			"set gt_realm": win.quakelive.siteConfig.realm,
			"com_cameramode": 1
		};

		QLDP.debug("[QLDP] Content is loaded");
		$('head', QLDP.doc).append(QLDP.style);

		$('#qlv_topLinks', QLDP.doc).prepend('<a id="qldp-menu-link" href="javascript:;">Demo Player</a> | ');

		QLDP.updateDocumentBinds();
	}
	
	else {
		QLDP.isStarted = true;
		win.setTimeout(QLDP.run, 250);
	}
};

/**
 * sortDemoList(index)
 * This method will sort the demo list by the index. Index is grabbed from the
 * typeToIndex() function before this method is called. Depending on whether
 * the user has clicked on the column before, it'll sort ascending or descending.
 * @param index Index of the column (starting from 0) in the demo list.
 */
QLDP.sortDemoList = function (index, doFilter) {
	var $ = QLDP.$, order = 0, sortArr = [], ind = QLDP.filter[0], valType = QLDP.filter[1], valPlayers = QLDP.filter[2], valMap = QLDP.filter[3], valDate = QLDP.filter[4], i, o, t;

	// Switch order depending on if the user clicked on it once before
	if (!doFilter && QLDP.lastSort[0] === index) {
		order = QLDP.lastSort[1] ? 0 : 1;
	}

	//QLDP.debug('t:', valType, 'p:', valPlayers, 'm:', valMap, 'd:', valDate);

	for (i in QLDP.demoList) {
		o = QLDP.demoList[i];

		if (valType || valPlayers || valMap || valDate) {
			t = (o.type + o.players + (o.map || "") + (o.date || "") + (o.time || "")).toLowerCase();

			//if (valType && o.type.indexOf(valType) >= 0 || valPlayers && o.players.indexOf(valPlayers) >= 0 || valMap && o.map.indexOf(valMap) >= 0 || valDate && (o.date + o.time).indexOf(valDate) >= 0) {
			if (valType && o.type.toLowerCase().indexOf(valType) === -1) { continue; }
			if (valPlayers && o.players.replace(/<.+?>/g, '').toLowerCase().indexOf(valPlayers) === -1) { continue; }
			if (valMap && o.map.toLowerCase().indexOf(valMap) === -1) { continue; }
			if (valDate && (o.date + o.time).indexOf(valDate) === -1) { continue; }

			sortArr.push(i);
		}

		else if (!valType && !valPlayers && !valMap && !valDate) {
			sortArr.push(i);
		}
	}

	sortArr.sort(function (a, b) {
		var
			// The actual switch depending on if the user clicked on it once before
			ix = index  === 0 ? 'type' : (index === 1 ? 'players' : (index === 2 ? 'map' : 'date')),
			t1 = QLDP.demoList[(order ? a : b)][ix],
			t2 = QLDP.demoList[(order ? b : a)][ix];

		// Sort by time of day also, so we have to add that too
		if (ix === "date") {
			t1 += " " + QLDP.demoList[(order ? a : b)].time;
			t2 += " " + QLDP.demoList[(order ? b : a)].time;
		}

		return t1 === t2 ? 0 : (t1 < t2 ? -1 : 1);
	});

	QLDP.lastSort = [index, order];
	QLDP.sortList = sortArr;

	QLDP.setDemoPage(1);
};

/**
 * setDemoPage(index)
 * Sets the currently viewed page to 'index', used whenever filter or sorting
 * is triggered.
 * @param index Page to set.
 */
QLDP.setDemoPage = function (index) {
	var $ = QLDP.$, $rows = $('#qldp-list tbody tr', QLDP.doc), $p = $('#qldp-list tfoot tr td', QLDP.doc), start = 0, stopIndex = index * QLDP.pages[2], startIndex = (index - 1) * QLDP.pages[2], i, $row, demo;

	for (i = startIndex; i < stopIndex; i++) {
		$row = $rows.eq(start);
		demo = QLDP.demoList[QLDP.sortList[i]];
		start++;
	
		if (demo) {
			$row.attr('rel', QLDP.sortList[i]);
			$row.attr('title', 'Filename: ' + demo.name);
		
			$('#qldp-playlist option[rel="' + QLDP.sortList[i] + '"]', QLDP.doc).length ? $row.addClass('selected') : $row.removeClass('selected');
			
			$row.find('td:eq(0)').html(demo.type);
			$row.find('td:eq(1)').html(demo.players);
			$row.find('td:eq(2)').html(demo.map || "");
			$row.find('td:eq(3)').html(demo.date + " " + demo.time);

		}
		else {
			$row.removeClass('selected').removeAttr('rel').removeAttr('title').find('td').html("");
		}
	}

	QLDP.pages[0] = index;
	QLDP.pages[1] = Math.ceil(QLDP.sortList.length / QLDP.pages[2]);
	
	$p.find('p input').val(index);
	
	$p.find('p span').text('/' + QLDP.pages[1] + " (" + QLDP.sortList.length + " demos)");
};

/**
 * updateDocumentBinds()
 * This method is called everytime the document seems to have replaced the demo
 * list.
 */
QLDP.updateDocumentBinds = function () {
	var $ = QLDP.$, win = QLDP.win;

	// Actually open up the GUI
	$("#qldp-menu-link", QLDP.doc).click(function() {
		if (!$('div.qldp-enabled', QLDP.doc).length) {

			// Either add the newly grabbed GUI from file, or from cache
			$('#qlv_preLogContent', QLDP.doc).prepend(QLDP.layoutCache !== '' ?
				$(QLDP.layoutCache, QLDP.doc).eq(0) : QLDP.html);

			// Init the demo list, trigger update also
			QLDP.layoutCache === "" ? QLDP.sortDemoList(3) : QLDP.sortDemoList(QLDP.lastSort[0], true);

			QLDP.updateOldPlaylists();
			
			QLDP.documentBinds();
		}
	});

	// Auto-remove the Demo Player overlay
	$(QLDP.doc).click(function (e) {
		if ($('div.qldp-enabled', QLDP.doc).length && e.target.id !== "qldp-menu-link") {

			var t = e.target;
	
			while (t && t.id !== "qlv_preLogContent" && t && t.tagName !== "BODY") {
				t = t.parentNode;
			}
	
			if (t && t.id !== "qlv_preLogContent") {
				QLDP.hideQLDP();
			}
		}
	});
};

QLDP.documentBinds = function () {
	var $ = QLDP.$, win = QLDP.win;

		// Paginate, previous
		$('#qldp-previous', QLDP.doc).click(function () {
			if (QLDP.pages[0] - 1 > 0) {
				QLDP.setDemoPage(QLDP.pages[0] - 1);
			}
		});


		// Paginate, next
		$('#qldp-next', QLDP.doc).click(function () {
			if (QLDP.pages[0] + 1 <= QLDP.pages[1]) {
				QLDP.setDemoPage(QLDP.pages[0] + 1);
			}
		});


		// Hook sorting on table headers
		$('#qldp-list thead td', QLDP.doc).click(function (e) {
			if (e.originalTarget.tagName === "TD") {
				QLDP.sortDemoList( QLDP.typeToIndex($(e.target).text()) );
			}
		});


		// Hook add-to-playlist
		$('#qldp-list tbody', QLDP.doc).click(function (e) {
			QLDP.addRemoveFromPlaylist(e.target);
		});


		// Hook first/last page
		$('#qldp-first,#qldp-last', QLDP.doc).click(function (e) {
			if (e.target.id === "qldp-first") {
				QLDP.setDemoPage(1);
			}
			else {
				QLDP.setDemoPage(QLDP.pages[1]);
			}
		});


		// Hook up/down buttons for playlist
		$('#qldp-playlist-up, #qldp-playlist-down', QLDP.doc).click(function (e) {
			var $move = $('#qldp-playlist :selected', QLDP.doc), $options = $('#qldp-playlist option', QLDP.doc);

			if (e.target.id === 'qldp-playlist-up') {
				if ($options.eq(0).get(0) !== $move.get(0)) {
					$move.insertBefore($move.prev('option'));
				}
			}
			else {
				if ($options.filter(':last').get(0) !== $move.get(0)) {
					$move.insertAfter($move.next('option'));
				}
			}
		});

		// Remove button in playlist
		$('#qldp-playlist-remove', QLDP.doc).click(function () {
			var $opt = $('#qldp-playlist :selected', QLDP.doc), rel = $opt.attr('rel');

			if (rel !== "") {
				$opt.remove();
				$('#qldp-playlist option:last', QLDP.doc).attr('selected', 'selected');
				$('#qldp-list tr[rel="' + rel + '"]', QLDP.doc).removeClass('selected');
			}
		});


		// Trigger loaded demos from the active playlist when it's changed
		$('#qldp-old-playlists', QLDP.doc).change(function (e) {
			var $ = QLDP.$, i, fileContent, re, m;

			for (i = 0; i < QLDP.fromOldPl.length; i++) {
				if ( $('#qldp-playlist option[rel="' + QLDP.fromOldPl[i] + '"]', QLDP.doc).length ) {
					$('#qldp-playlist option[rel="' + QLDP.fromOldPl[i] + '"]', QLDP.doc).remove();
				}
			}

			// Empty demos-from-playlist array
			QLDP.fromOldPl = [];

			if ( $('#qldp-old-playlists', QLDP.doc).val() !== "reset" ) {
				// Parse demo playlist cfg for demos
				fileContent = QLDP.getFileContent($('#qldp-old-playlists', QLDP.doc).val(), QLDP.directory.playlistPath);

				re = /demo (.+?\.dm_73)/g;

				while ( (m = re.exec(fileContent) ) != null) {
					m[1] = QLDP.directory.nsIObj.path + QLDP.directory.pathSeperator + m[1];
					QLDP.fromOldPl.push(m[1]);
					QLDP.addRemoveFromPlaylist(null, m[1]);
				}
			}

			// Update GUI
			QLDP.setDemoPage(1);
		});


		// Filter demos by free search
		$('#qldp-filter-type,#qldp-filter-players,#qldp-filter-map,#qldp-filter-date', QLDP.doc).bind('keyup', function (e) {
			var $filters = $('#qldp-filter-type,#qldp-filter-players,#qldp-filter-map,#qldp-filter-date', QLDP.doc), i = 0; // .eq(0) = type etc.
			
			for (; i < 4; i++) {
				QLDP.filter[i+1] = $filters.eq(i).val().toLowerCase();
			}

			QLDP.sortDemoList(QLDP.lastSort[0], true);
		});


		// Go to page through input in the table footer input
		$('#qldp-goto-page', QLDP.doc).keyup(function () {
			var val = parseInt($('#qldp-goto-page', QLDP.doc).val(), 10);

			if (isNaN(val)) {
				return;
			}

			if (val > QLDP.pages[1]) {
				val = QLDP.pages[1];
			}

			if (val < 1) {
				val = 1;
			}

			QLDP.setDemoPage(val);
		});


		// Hook the 'Play demo' button
		$('#qldp-go', QLDP.doc).click(function (e) {
			var $opt = $('#qldp-playlist option', QLDP.doc), $oldPl = $('#qldp-old-playlists', QLDP.doc), tmp, i, prefs, params = QLDP.extend(QLDP.defaultLaunchParams, {}), execs = [];
			
			// Get custom demo cfg
			tmp = QLDP.getPrefValue('democfg');
			execs.push(tmp === "" ? '"demo.cfg"' : '"' + tmp + '"');
			
			// Get overridden fullscreen
			tmp = QLDP.getPrefValue('fullscreen');
			if (tmp !== "") {
				QLDP.extend(params, { "set r_fullscreen": tmp });
			}

			// Do nothing if no demos are queued
			if (!$opt.length) {
				return;
			}

			// Just one demo, do not generate a playlist cfg
			else if ($opt.length === 1) {
				params = QLDP.extend(params, { demo: QLDP.demoList[$opt.attr('rel')].name });
			}
			
			// Create playlist cfg
			else {
				tmp = QLDP.generatePlaylist();
				tmp = QLDP.createPlaylist(tmp);

				if (tmp === "error") {
					win.alert("Something went wrong when generating the playlist file.\nPlease report this back to the author.");
					return;
				}
				
				else {
					execs.push('"' + tmp + '"');
				}
			}

			var newParams = new QLDP.createFakeLaunchParams();

			for (i in params) {
				newParams.Append( ' +' + i + ' "' + params[i] + '"' );
			}

			newParams.Append( ' +exec ' + execs.join(' +exec ') );
			
			QLDP.debug("[QLDP] Launch parameters:", newParams);

			// Launch the demo
			win.LaunchGame(newParams);
		});


		// Close button
		$('#qldp .close_window', QLDP.doc).click(function () {
			QLDP.hideQLDP();
		});
};

/**
 * hideQLDP()
 * Hides the overlay.
 */
QLDP.hideQLDP = function () {
	QLDP.layoutCache = QLDP.$('#qlv_preLogContent', QLDP.doc).html();
	QLDP.$('#qlv_prefsoverlay', QLDP.doc).remove();
};

/**
 * typeToIndex(type)
 * @returns The type in a index type form.
 */
QLDP.typeToIndex = function (type) {
	switch (type) {
	case 'Type':
		return 0;
	case 'Player(s)':
		return 1;
	case 'Map':
		return 2;
	case 'Date':
		return 3;
	case 'ALL':
		return 4;
	}
};

/**
 * updateOldPlaylists()
 * 
 */
QLDP.updateOldPlaylists = function () {
	var $ = QLDP.$, $pl = $('#qldp-old-playlists', QLDP.doc), playlistDir = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile), pls = [], plObj = {}, children, child, m, c, i, appStr, dateStr, compDate;
	
	playlistDir.initWithPath(QLDP.directory.playlistPath);
	children = playlistDir.directoryEntries;
	$pl.find(':gt(0)').remove();
	
	while (children.hasMoreElements()) {  
		child = children.getNext().QueryInterface(Components.interfaces.nsILocalFile);
		
		if (child.leafName.match(/\d{4}_\d{2}_\d{2}-\d{2}_\d{2}_\d{2}\.cfg$/)) {
			m = /(.+?)-(\d{4}_\d{2}_\d{2})-(\d{2}_\d{2}_\d{2})\.cfg$/.exec(child.leafName);
			compDate = m[2].replace(/_/g, '') + m[3].replace(/_/g, '');
			pls.push(compDate);
			
			appStr = m[1] === "qldp-playlist" ? "Playlist" : m[1];
			dateStr = m[2].replace(/_/g, '-') + " " + m[3].replace(/_/g, ':');

			plObj[compDate] = { name: appStr, date: dateStr, file: child.leafName };
		}
	}

	pls.sort(function (a, b) {
		return a < b;
	});
	
	for (i = 0; i < pls.length; i++) {
		c = plObj[pls[i]];
		$pl.append('<option value="' + c.file + '">' + (c.name + ' (' + c.date + ')') + '</option>');
	}
};

/**
 * addRemoveFromPlaylist(el, force)
 * 
 */
QLDP.addRemoveFromPlaylist = function (el, force) {
	var $ = QLDP.$, $tr = el, demoFile, r, $option = $('<option/>', QLDP.doc), demoId, demoText;

	if (!force) {
		$tr = $($tr, QLDP.doc).closest('tr');
		demoId = $tr.attr('rel');
	}
	else {
		demoId = force;
	}

	if (!force && (!demoId || $tr.get().tagName === "BODY")) {
		return;
	}

	demoFile = QLDP.demoList[demoId];

	// Is already in playlist, remove it
	if ($tr && $tr.hasClass('selected')) {
		$('#qldp-playlist option[rel="' + demoId + '"]', QLDP.doc).remove();
		$tr.removeClass('selected');

		return;
	}
	
	// Try to find the TR, and highlight
	if (!$tr) {
		$('#qldp-list [rel="' + demoId + '"]', QLDP.doc).addClass('selected');
	}
	else {
		$tr.addClass('selected');
	}

	$option.attr('rel', demoId);

	if ( !$('#qldp-playlist option[rel="' + demoId + '"]', QLDP.doc).length && demoFile) {
		if (demoFile && demoFile.type && demoFile.type !== "Unknown") {
			demoText = demoFile.type.replace(/<.+?>/g, " ") + ", " +
									demoFile.players.replace(/<.+?>/g, " ") +
									(demoFile.map ? ", " + demoFile.map.replace(/<.+?>/g, " ") : "");
			
			$('#qldp-playlist', QLDP.doc).append( $option.text(demoText) );
		}
		else {
			$('#qldp-playlist', QLDP.doc).append( $option.text(demoFile.name) );
		}
	}
}
