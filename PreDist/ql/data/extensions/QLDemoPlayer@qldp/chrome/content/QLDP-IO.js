/**
 * ioinit(callback)
 * Initializes the i/o interface
 * @param callback The function to invoke when we're ready
 */
QLDP.ioInit = function (callback) {
	QLDP.setupExtensionPath(function () {
		QLDP.setupDirectories();
		QLDP.setupPlaylistPath();
		callback();
	});
};

/**
 * fileExists(f)
 * Checks if the path/file exists
 * @param f File/path to check
 * @returns true/false if it exists or not
 */
QLDP.fileExists = function (f) {
	var file = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);

	file.initWithPath(f);

	return file.exists();
};

/**
 * Find the path for the extension, e.g.
 * /home/user/.mozilla/firefox/<profile>/extensions/QLDemoPlayer@qldp or equivalent.
 */
QLDP.setupExtensionPath = function (callback) {
	// Get initial path to the QLDP extension
	var path;

	try {
		// FF4+
		Components.utils.import("resource://gre/modules/AddonManager.jsm");
		AddonManager.getAddonByID("QLDemoPlayer@qldp", function(addon) {
			path = addon.getResourceURI("chrome").QueryInterface(Components.interfaces.nsIFileURL).path;

            // Circumvent (a bug?) path slashes
            if (navigator.userAgent.indexOf('Windows') >= 0) {
                path = path.substr(1, path.length);
                path = path.replace(/\//g, "\\");
            }

			setPath(true);
		});
	}
	catch (ex) {
		// FF2-FF3.6
		path = Components.classes["@mozilla.org/extensions/manager;1"]
			.getService(Components.interfaces.nsIExtensionManager)
			.getInstallLocation("QLDemoPlayer@qldp").getItemFile("QLDemoPlayer@qldp", "chrome").path;

		setPath(false);
	}

	function setPath(isFF4) {
		// Parse the file seperator (/ on unix, \ on windows)
		QLDP.directory.pathSeperator = (path.search(/\\/) !== -1) ? "\\" : "/";

		// Append the last ending (chrome/content/GUI.html) to the path
		path = path + (isFF4 ? "" : QLDP.directory.pathSeperator) + "content" + QLDP.directory.pathSeperator;
		QLDP.directory.chrome = isFF4 ? decodeURI(path) : path;

		callback();
	}
};

/**
 * This will set the QLDP.directory.nsIObj to a nsI-object, which we can use .path on
 * and .children to get the file tree structure.
 */
QLDP.setupDirectories = function() {
	var appDataDir = "", aPath = "", demoDir, prefs;

	// Get the "extensions.myext." branch
	prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService);

	prefs = prefs.getBranch("extensions.qldp.");

	try {
		// Path
		appDataDir = prefs.getComplexValue("path", Components.interfaces.nsISupportsString).data;
	} catch (e) {}

	// Initialize new nsI component that'll hold the path and childs etc.
	demoDir = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);

	if (appDataDir === "") {
		// Windows
		try {
			appDataDir = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("AppData", Components.interfaces.nsIFile)
				.path.replace(/Roaming/, ''); // Replace Vista/Win7 "Roaming" path in AppData

			aPath = "id Software\\quakelive\\home\\baseq3\\demos";

			// Vista/Win7
			if (navigator.userAgent.match(/NT 6\./)) {
				aPath = "LocalLow\\" + aPath;
			}

			//XP
			if (navigator.userAgent.match(/NT 5\./)) {
				aPath = aPath;
			}

			demoDir.initWithPath(appDataDir);
			demoDir.appendRelativePath(aPath);
		}


		// Linux/Mac
		catch (er) {
			navigator.userAgent.match(/Linux/) ?
				// Linux
				appDataDir = "~/.quakelive/quakelive/home/baseq3/demos":
				// Mac
				appDataDir = "~/Library/Application Support/QuakeLive/quakelive/home/baseq3/demos";

			demoDir.initWithPath(appDataDir);
		}
	}
	else {
		QLDP.debug("[QLDP] Warning, demo directory is overridden:", appDataDir);
		demoDir.initWithPath(appDataDir);
	}

	if (demoDir.exists()) {
		QLDP.directory.lastModified = demoDir.lastModifiedTime;
	} else {
		// bugfix - create demos directory if it does not exist so that demo player will actually load
		// qlprism installer will correctly set the modified user agent in qlprism\defaults\preferences\preferences.js based on
		// version of windows installed, which still allows for spoofed user-agent making qlprism indistinguishable from firefox
		// to the ql website

		if (navigator.userAgent.match(/NT 5\./) || navigator.userAgent.match(/NT 6\./)) {
		appDataDir = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("AppData", Components.interfaces.nsIFile)
				.path.replace(/Roaming/, ''); // Replace Vista/Win7 "Roaming" path in AppData
		}

		if (navigator.userAgent.match(/Linux/)) {
		appDataDir = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("Home", Components.interfaces.nsIFile).path
		}
			aPath = "id Software\\quakelive\\home\\baseq3\\demos";

			// Vista/Win7
			if (navigator.userAgent.match(/NT 6\./)) {
				aPath = "LocalLow\\" + aPath;
			}
			//XP
			if (navigator.userAgent.match(/NT 5\./)) {
				aPath = aPath;
			}

			if(navigator.userAgent.match(/Linux/)) {
				// Linux
				aPath = ".quakelive/quakelive/home/baseq3/demos";
			}


			demoDir.initWithPath(appDataDir);
			demoDir.appendRelativePath(aPath);

		demoDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);

	}

	QLDP.directory.nsIObj = demoDir;
};

/**
 * This will apply the qldp-playlists folder in relation to the demo dir, basically
 * demodir/../qldp-playlists/, but since Firefox doesn't allow ../'s we do it this way.
 */
QLDP.setupPlaylistPath = function () {
	var t = QLDP.directory.nsIObj,
		dir = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);

	dir.initWithPath(t.parent.path);
	dir.appendRelativePath("qldp-playlists");
	QLDP.debug("[QLDP] Playlist path:", dir.path);

	// Create playlist folder if it doesn't exist
	if (!dir.exists() || !dir.isDirectory()) {
		dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
	}

	try {
		QLDP.directory.plLastModified = dir.lastModifiedTime;
	} catch (e) {
		QLDP.directory.plLastModified = 0;
	}

	QLDP.directory.playlistPath = dir.path;
};

/**
 * getFileContent(name)
 * This function will grab the contents of 'name', a file in the chrome/contents
 * directory inside the extension folder. It should never fail, and if it does,
 * I couldn't find a way to alert the user (although the console will spit) out
 * a "Invalid chrome URI" error.
 */
QLDP.getFileContent = function (name, p) {
	var path = QLDP.directory.chrome, file, inputStream, sInputStream;

	// Override
	if (p) path = p;

	// Create the file and instantiate it with the path built above
	file = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);

	file.initWithPath(path + QLDP.directory.pathSeperator + name);

	// Try to open up a file stream for the file
	inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
		.createInstance(Components.interfaces.nsIFileInputStream);

	// Append the file to the input stream
	inputStream.init(file, 0x01, 00004, null);

	// Finally *phew*, read the contents
	sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
		.createInstance(Components.interfaces.nsIScriptableInputStream);

	sInputStream.init(inputStream);

	return sInputStream.read(sInputStream.available()) || "";
};

/**
 * updateDemoCache()
 * Updates the cached demo files (QLDP.demoList) (calling the Wrapper)
 */
QLDP.updateDemoCache = function () {
	QLDP.demoList = {};
	QLDP.ssList = {};
	QLDP.updateDemoCacheWrapper();
	QLDP.totalDemos = (QLDP.demoList).__count__ || (function(){
		var i = 0;
		for (var k in QLDP.demoList) {i++;}
		return i;
	}());

	QLDP.pages = [1, 1, QLDP.pages[2]];
	QLDP.debug("[QLDP] Demo cache updated, found", QLDP.totalDemos, "demos");
};

/**
 * updateDemoCacheWrapper(c)
 * Updates the demo cache object (QLDP.demoList)
 * @param c Optional argument (nsILocalFile), used in conjunction with the
 * initial search, you shouldn't need to use this argument.
 */
QLDP.updateDemoCacheWrapper = function (c) {
	var children = c ? c.directoryEntries : QLDP.directory.nsIObj.directoryEntries, child, d1, d2, x, match, time;

	// Loop through all files within the demo folder
	while (children.hasMoreElements()) {
		child = children.getNext().QueryInterface(Components.interfaces.nsILocalFile);

		if (child.isFile() && child.leafName.match(/\.dm_73$/i)) {
			QLDP.demoList[child.path] = QLDP.parseDemoName(child.path.replace(QLDP.directory.nsIObj.path + QLDP.directory.pathSeperator, ""));
		}

		// "child" is a directory, invoke this method with the child as initiator
		else if (child.isDirectory()) {
			QLDP.updateDemoCacheWrapper(child);
		}
	}
};

/**
 * checkForDemos()
 * Self-invoking function (after initialized) that'll listen for demo directory changes and update
 * the demo list every-so-often.
 */
QLDP.checkForDemos = function () {
	var demoDir = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile),
		plDir = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);

	demoDir.initWithPath(QLDP.directory.nsIObj.path);
	plDir.initWithPath(QLDP.directory.playlistPath);

	if (QLDP.directory.lastModified !== demoDir.lastModifiedTime) {
		QLDP.debug("[QLDP] Demo directory has been altered");

		QLDP.directory.lastModified = demoDir.lastModifiedTime;
		QLDP.directory.nsIObj = demoDir;
		QLDP.updateDemoCache();
		QLDP.sortDemoList(QLDP.lastSort[0], true);
	}

	if (QLDP.fileExists(QLDP.directory.playlistPath) && (QLDP.directory.plLastModified !== plDir.lastModifiedTime)) {
		QLDP.directory.plLastModified = plDir.lastModifiedTime;
		if (QLDP.$('#qldp-old-playlists', QLDP.doc).length) QLDP.updateOldPlaylists();
		QLDP.debug("[QLDP] Playlist directory has been altered");
	}

	setTimeout(QLDP.checkForDemos, QLDP.directory.searchInterval * 1000);
};

/**
 * parseDemoName(name)
 * Parses the file and tries to create a more readable name for it.
 * @param name The leafName of the file to be parsed
 * @returns An object containing the info, or an empty object if failed
 */
QLDP.parseDemoName = function (name) {
	var
		$ = QLDP.$, m, date, time, type, map, players, retObj = {
			name: name,
			type: '<em>Unknown</em>',
			players: name.replace('.dm_73', ''),
			map: "",
			date: "",
			time: ""
		};

	// Remove any paths in the name so it doesn't interfere with the presentation
	name = name.split(QLDP.directory.pathSeperator);
	name = name[name.length - 1];

	players = '' + name;

	var typeexp = /^TDM-|^CTF-|^CA-|^FFA-|^FT-/;;
	var duelexp = /-vs-/;
	var duelexp2 = /\(POV\)/;
	var duelexp3 = /-vs-/;
	if (type = name.match(typeexp))
	{
		type = type + "";
		type = type.replace(/-/,"");
		players = players.replace(typeexp,"");
	}
	else if (duelexp.test(name))
	{
		type = "Duel";
		players = players.replace(duelexp2,"");
		players = players.replace(duelexp3," <strong>VS</strong> ");
	}
	else
	{
		type = "-";
	}

	var dateexp = /-\d{4}_\d{2}_\d{2}-/;
	if (date = name.match(dateexp))
	{
		date = date + "";
		date = date.replace(/-/g,"");
		date = date.replace(/_/g,"-");
		players = players.replace(/-\d{4}_\d{2}_\d{2}/,"");
	}
	else
	{
		date = "-";
	}

	var timeexp = /-\d{2}_\d{2}_\d{2}/;
	if (time = name.match(timeexp))
	{
		time = time + "";
		time = time.replace(/-/g,"");
		time = time.replace(/\./g,"");
		time = time.replace(/_/g,":");
		players = players.replace(timeexp,"");
	}
	else
	{
		time = "-";
	}

	var mapexp = /-[\w]+-\d{4}_\d{2}_\d{2}-\d{2}_\d{2}_\d{2}/;
	var mapexp2 = /-[\w]+\.dm_73/;
	if (map = name.match(mapexp))
	{
		map = map + "";
		map = map.replace(/-\d{4}_\d{2}_\d{2}-\d{2}_\d{2}_\d{2}/,"");
		map = map.replace(/-/,"");
		players = players.replace(map,"");
	}
	else if (map = name.match(mapexp2))
	{
		map = map + "";
		map = map.replace(/-/,"");
		map = map.replace(/\.dm_73/,"");
		players = players.replace(map,"");
	}
	else
	{
		map = "-";
	}

	players = players.replace(/dm_73/,"");
	players = players.replace(/\.$/,"");
	players = players.replace(/-+$/g," ");
	players = players.replace(/^\s+/,"");
	players = players.replace(/\s+$/,"");

	if (players == "")
	{
		players = "-";
	}

	retObj = QLDP.extend(retObj, {
		type: type,
		players: players,
		map: map,
		date: date,
		time: time
	});

	return retObj;
};

/**
 * generatePlaylist()
 * Will generate CFG parameters for the playlist file, thanks to GreasedScotsman
 * for the quick 'n dirty (but straight-forward) idea. :)
 * http://www.quakelive.com/forum/showpost.php?p=222334&postcount=9
 * @returns A string, a generated playlist in CFG format
 */
QLDP.generatePlaylist = function () {
	var i, resp = "", $entries = QLDP.$('#qldp-playlist option', QLDP.doc);

	resp += "set playlistEnd \"\"\n";

	for (i = 0; i < $entries.length; i++) {
		resp += "set plEntry" + i + " \"demo " + QLDP.demoList[$entries.eq(i).attr('rel')].name + "; echo \"Playing entry #" + (i + 1) + " of " + ($entries.length) + "\"; set next-demo \"vstr nextdemo\"; set prev-demo \"vstr plEntry" + (i !== 0 ? i - 1 : 0) + "\"; set nextdemo vstr " + (i + 1 === $entries.length ? "playListEnd" : "plEntry" + (i + 1)) + "\"\n";
	}

	resp += "vstr plEntry0\n";

	return resp;
};

/**
 * createPlaylist(content)
 * This will create a file (and a container folder if it doesn't exist) for this
 * playlist.
 * @returns the path to the playlist file (for easy integration to the launcher)
 */
QLDP.createPlaylist = function (content) {
	function padZero(i) {
		return i < 10 ? "0" + i : i;
	}

	try {
		var
			playlistFolder = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile),
			playlistFile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile),
			playlistOS = Components.classes["@mozilla.org/network/file-output-stream;1"].
				createInstance(Components.interfaces.nsIFileOutputStream),
			converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
				createInstance(Components.interfaces.nsIConverterOutputStream),

			d = new Date(),
			folder,
			filename = "qldp-playlist-" + d.getFullYear() + "_" + padZero(d.getMonth() + 1) + "_" + padZero(d.getDate()) + "-" + padZero(d.getHours()) + "_" + padZero(d.getMinutes()) + "_" + padZero(d.getSeconds()) + ".cfg";

		// Init playlist folder with paths and such
		playlistFolder.initWithPath(QLDP.directory.playlistPath);

		// Create playlist folder if it doesn't exist
		if (!playlistFolder.exists() || !playlistFolder.isDirectory()) {
			playlistFolder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
		}

		folder = playlistFolder.path;

		// Init file with paths and filename
		playlistFile.initWithPath(folder + QLDP.directory.pathSeperator + filename);
		playlistOS.init(playlistFile, 0x02 | 0x08 | 0x20, 0666, 0);

		// FINALLY! Append the data
		converter.init(playlistOS, "UTF-8", 0, 0);
		converter.writeString(content);
		converter.close();

		QLDP.debug("[QLDP] New playlist:", filename, "in folder:", folder);

		return "qldp-playlists" + QLDP.directory.pathSeperator + filename;
	}
	catch (e) {
		QLDP.debug('[QLDP] Generating playlist file failed:', e);
		return "error";
	}
};

/**
 * setPrefValue(preference, value)
 * Try to set the preference value from the extensions branch in Firefox.
 */
QLDP.setPrefValue = function (pref, val) {
	var
		prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),
		str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);

	prefs = prefs.getBranch("extensions.qldp.");
	str.data = val;

	try {
		prefs.setComplexValue(pref, Components.interfaces.nsISupportsString, str);
	}
	catch (e) {}
};

/**
 * getPrefValue(preference)
 * Try to get the preference value from the extensions branch in Firefox.
 * @returns the value or an empty string
 */
QLDP.getPrefValue = function (pref) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService), retVal = "";

	prefs = prefs.getBranch("extensions.qldp.");

	try {
		retVal = prefs.getComplexValue(pref, Components.interfaces.nsISupportsString).data;
	}
	catch (e) {}

	return retVal || "";
};

/**
 * createFakeLaunchParams(params)
 * Creates a new parameter object that can be sent into the quakelive launcher.
 */
QLDP.createFakeLaunchParams = function (params) {
	var self = this;//, win = QLDP.win, realWin = QLDP.doc.defaultView, getIntVal = win.quakelive.cvars.GetIntegerValue;

	params = QLDP.extend({
		password: null,
		noInputGrab: false,
		noAudio: false,
		noAds: false,
		hasFullscreen: false,
		browserMode: 12,
		shrinkViewport: false,
		isTraining: true
	}, params);

	self.cmdStrings = [];
	self.password = params.password;

	self.hasFullscreen = 0; //getIntVal.apply(realWin, ["r_fullscreen", 0]) != 0;
	self.browserMode = 5; //getIntVal.apply(realWin, ["r_inbrowsermode", 12]);

	self.Append = function(str) {
		self.cmdStrings.push(str);
	};

	self.Prepend = function(str) {
		self.cmdStrings.shift(str);
	};

	self.GetCommandLine = function() {
		return self.cmdStrings.join(' ');
	};
};
