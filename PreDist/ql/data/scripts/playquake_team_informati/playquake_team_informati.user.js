// ==UserScript==
// @name           PlayQuake Team Information
// @namespace      playquake.com
// @version        1.0
// @description    Get the latest teams for a certain Quakelive server used in a pickup-game
// @author         smove
// @include        http://*.quakelive.com/*
// @exclude        http://*.quakelive.com/forum/*
// @run-at         document-end
// ==/UserScript==


// Taken from: http://wiki.greasespot.net/Content_Script_Injection
function contentEval(source) {
	// Check for function input.
	if ("function" == typeof (source)) {
	    // Execute this function with no arguments, by adding parentheses.
	    // One set around the function, required for valid syntax, and a
	    // second empty set calls the surrounded function.
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

/*
 * This will handle the team-request-event send by /teams within QL
 */
function handleTeamRequest(event) {
	var request;
	try {
		request = JSON.parse(event.data);
	} catch (e) {
		return;
	}

	// only team-request allowed here
	if (!(request.type) || "PQ:teamRequest" != request.type) {
		return;
	}

	GM_xmlhttpRequest({
		method : 'GET',
		url : 'http://bot.xurv.org/teams.php?id=' + request.serverID,
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded"
		},
		onload : function(data) {
			try {
				var response = JSON.parse(data.responseText);
				response.type = "PQ:response";
			} catch (e) {
				console.log("Couldn't parse requested data: " + e);
				return;
			}
			window.postMessage(JSON.stringify(response), "*");
		}

	});
}
window.addEventListener("message", handleTeamRequest, false);

/*
 * Hopefully we'll get a response to our request, this function takes care of it
 */
contentEval(function() {
	PQT = {
		handleResponse : function(event) {
			var response;
			try {
				response = JSON.parse(event.data);
			} catch (e) {
				console.log("Couldn't parse event data: " + e);				
				return;
			}

			// only response messages allowed here
			if (!(response.type) || "PQ:response" != response.type ) {
				return;
			}
		
			if (response.ECODE < 0) {
				qz_instance.SendGameCommand("echo Can't find any teams for this server.;");
				return;
			}
			try {
				var teamR = response.teamRed;
				var teamB = response.teamBlue;
				var mapPicker = response.mapPicker;
			} catch (e) {
				console.log("Couldn't parse the teams: " + e);
				return;
			}

			var teamRString = "^1Red:^7 ";
			var teamBString = "^4Blue:^7 ";
			var tmp;
			for ( var i = 0; i < teamR.length; i++) {
				tmp = teamR[i];
				if (teamR[i] == mapPicker) {
					tmp = "^3" + teamR[i] + "^7";
				}
				teamRString += tmp + " ";				
			}			
			for ( var i = 0; i < teamB.length; i++) {
				tmp = teamB[i];
				if (teamB[i] == mapPicker) {
					tmp = "^3" + teamB[i] + "^7";
				}
				teamBString += tmp + " ";
			}
			qz_instance.SendGameCommand('say ' + teamRString + ';');
			setTimeout(function(){
				qz_instance.SendGameCommand('say ' + teamBString + ';');
			}, 700);
		}
	};
	window.addEventListener("message", PQT.handleResponse, false);
});

/*
 * QL-Ingame-Commands and aliases are handled here
 */
contentEval(function() {
	if (typeof quakelive != 'object') {
		return;
	}
	var commands = {
		teams : {
			params : false,
			dft : 0,
			fn : function(val) {
				if (!quakelive.currentServerId) {
					qz_instance.SendGameCommand("echo Pickup with Bots? Have fun.;");
				} else {
					window.postMessage(JSON.stringify({
						"serverID" : quakelive.currentServerId,
						"type" : "PQ:teamRequest"
					}), "*");
				}
			}
		}		
	};
	var oldLaunchGame = LaunchGame, ready;
	LaunchGame = function(params, server) {
		ready = false;
		var i;
		for (i in commands) {
			if (commands[i].params) {
				params.Append('+set ' + i + ' "^7"');
				params.Append('+set ' + i + ' "' + commands[i].dft + '"');
			} else {
				commands[i].dft = 0;
				params.Append('+set GM_qlfc_' + i + ' "0"');
				params.Append('+alias ' + i + ' "set GM_qlfc_' + i + ' 1"');
			}
		}
		return oldLaunchGame.apply(this, arguments);
	};
	var oldOnCommNotice = OnCommNotice;
	OnCommNotice = function(error, data) {
		if (error == 0) {
			var msg = quakelive.Eval(data);
			if (msg.MSG_TYPE == 'serverinfo') {
				ready = true;
			}
		}
		return oldOnCommNotice.apply(this, arguments);
	};
	var oldOnCvarChanged = OnCvarChanged;
	OnCvarChanged = function(name, value, replicate) {
		var i;
		for (i in commands) {
			if ((commands[i].params && name == i)
					|| (!commands[i].params && name == 'GM_qlfc_' + i)) {
				if (value != commands[i].dft) {
					if (ready) {
						commands[i].fn(value);
					}
					qz_instance.SendGameCommand('set ' + name + ' "'
							+ commands[i].dft + '";');
				}
				replicate = 0;
			}
		}
		return oldOnCvarChanged.apply(this, arguments);
	};
});