/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/**
 * @fileOverview Bootstrap module, will initialize Adblock Plus when loaded
 */

var EXPORTED_SYMBOLS = ["Bootstrap"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let chromeSupported = true;
let ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
let publicURL = ioService.newURI("chrome://adblockplus-modules/content/Public.jsm", null, null);
let baseURL = publicURL.clone().QueryInterface(Ci.nsIURL);
baseURL.fileName = "";

try
{
	// Gecko 2.0 and higher - chrome URLs can be loaded directly
	Cu.import(baseURL.spec + "Utils.jsm");

}
catch (e)
{
	// Gecko 1.9.x - have to convert chrome URLs to file URLs first
	let chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIChromeRegistry);
	publicURL = chromeRegistry.convertChromeURL(publicURL);
	baseURL = chromeRegistry.convertChromeURL(baseURL);
	Cu.import(baseURL.spec + "Utils.jsm");

	chromeSupported = false;
}

if (publicURL instanceof Ci.nsIMutable)
	publicURL.mutable = false;
if (baseURL instanceof Ci.nsIMutable)
	baseURL.mutable = false;
		
const cidPublic = Components.ID("5e447bce-1dd2-11b2-b151-ec21c2b6a135");
const contractIDPublic = "@adblockplus.org/abp/public;1";

const cidPrivate = Components.ID("2f1e0288-1dd2-11b2-bbfe-d7b8a982508e");
const contractIDPrivate = "@adblockplus.org/abp/private;1";

let factoryPublic = {
	createInstance: function(outer, iid)
	{
		if (outer)
			throw Cr.NS_ERROR_NO_AGGREGATION;
		return publicURL.QueryInterface(iid);
	}
};

let factoryPrivate = {
	createInstance: function(outer, iid)
	{
		if (outer)
			throw Cr.NS_ERROR_NO_AGGREGATION;
		return baseURL.QueryInterface(iid);
	}
};

let defaultModules = [
	baseURL.spec + "Prefs.jsm",
	baseURL.spec + "FilterListener.jsm",
	baseURL.spec + "ContentPolicy.jsm",
	baseURL.spec + "Synchronizer.jsm",
	baseURL.spec + "Sync.jsm"
];

let loadedModules = {__proto__: null};

let initialized = false;

/**
 * Allows starting up and shutting down Adblock Plus functions.
 * @class
 */
var Bootstrap =
{
	/**
	 * Initializes add-on, loads and initializes all modules.
	 */
	startup: function()
	{
		if (initialized)
			return;
		initialized = true;


	
		// Register component to allow retrieving private and public URL
		
		let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
		registrar.registerFactory(cidPublic, "Adblock Plus public module URL", contractIDPublic, factoryPublic);
		registrar.registerFactory(cidPrivate, "Adblock Plus private module URL", contractIDPrivate, factoryPrivate);
	

	
		// Load and initialize modules
	

	
		for each (let url in defaultModules)
			Bootstrap.loadModule(url);



		let categoryManager = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
		let enumerator = categoryManager.enumerateCategory("adblock-plus-module-location");
		while (enumerator.hasMoreElements())
		{
			let uri = enumerator.getNext().QueryInterface(Ci.nsISupportsCString).data;
			Bootstrap.loadModule(uri);
		}

		let observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
		observerService.addObserver(BootstrapPrivate, "xpcom-category-entry-added", true);
		observerService.addObserver(BootstrapPrivate, "xpcom-category-entry-removed", true);
	

	},

	/**
	 * Shuts down add-on.
	 */
	shutdown: function()
	{
		if (!initialized)
			return;



		// Shut down modules
		for (let url in loadedModules)
			Bootstrap.shutdownModule(url);


	},

	/**
	 * Loads and initializes a module.
	 */
	loadModule: function(/**String*/ url)
	{
		if (url in loadedModules)
			return;

		let module = {};
		try
		{
			Cu.import(url, module);
		}
		catch (e)
		{
			Cu.reportError("Adblock Plus: Failed to load module " + url + ": " + e);
			return;
		}

		for each (let obj in module)
		{
			if ("startup" in obj)
			{
				try
				{
					obj.startup();
					loadedModules[url] = obj;
				}
				catch (e)
				{
					Cu.reportError("Adblock Plus: Calling method startup() for module " + url + " failed: " + e);
				}
				return;
			}
		}

		Cu.reportError("Adblock Plus: No exported object with startup() method found for module " + url);
	},

	/**
	 * Shuts down a module.
	 */
	shutdownModule: function(/**String*/ url)
	{
		if (!(url in loadedModules))
			return;

		let obj = loadedModules[url];
		if ("shutdown" in obj)
		{
			try
			{
				obj.shutdown();
			}
			catch (e)
			{
				Cu.reportError("Adblock Plus: Calling method shutdown() for module " + url + " failed: " + e);
			}
			return;
		}
	}
};

/**
 * Observer called on modules category changes.
 * @class
 */
var BootstrapPrivate =
{
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver, Ci.nsISupportsWeakReference]),

	observe: function(subject, topic, data)
	{
		if (data != "adblock-plus-module-location")
			return;

		switch (topic)
		{
			case "xpcom-category-entry-added":
				Bootstrap.loadModule(subject.QueryInterface(Ci.nsISupportsCString).data);
				break;
			case "xpcom-category-entry-removed":
				Bootstrap.unloadModule(subject.QueryInterface(Ci.nsISupportsCString).data, true);
				break;
		}
	}
};
