const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

const nsIProtocolHandler = Ci.nsIProtocolHandler;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function QLPrismProtocol() {
}

QLPrismProtocol.prototype = {
  scheme: "qlprism",
  protocolFlags: nsIProtocolHandler.URI_NORELATIVE |
                 nsIProtocolHandler.URI_NOAUTH |
                 nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,

  newURI: function(aSpec, aOriginCharset, aBaseURI)
  {
    var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
    uri.spec = aSpec;
    return uri;
  },

  newChannel: function(aURI)
  {
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    var serverlink = aURI.spec.replace(/qlprism\:\/\//g, '');
    serverlink = escape(serverlink);

    var uri = ios.newURI("http://www.quakelive.com/"+serverlink, null, null);
    var channel = ios.newChannelFromURI(uri, null).QueryInterface(Ci.nsIHttpChannel);
    channel.setRequestHeader("X-Moz-Is-Feed", "1", false);
    return channel;
  },
  classDescription: "QLPrism Protocol",
  contractID: "@mozilla.org/network/protocol;1?name=" + "qlprism",
  classID: Components.ID('{65233423-af9e-4bbf-8f2b-6c3c0f29aefe}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([QLPrismProtocol]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([QLPrismProtocol]);
