/*
*/

const Cc = Components.classes;
const Ci = Components.interfaces;

const PR_WRONLY = 0x02;
const PR_CREATE_FILE = 0x08;
const PR_TRUNCATE = 0x20;
const PR_UINT32_MAX = 4294967295;

EXPORTED_SYMBOLS = ["ImageUtils"];

var ImageUtils =
{
  createNativeIcon : function(inputStream, mimeType, outputStream) {
    // Convert from source format to native icon format
    var imageTools = Cc["@mozilla.org/image/tools;1"].createInstance(Ci.imgITools);

    // The image decoders use ReadSegments, which isn't implemented on
    // file input streams. Use a buffered stream to make it work.
    var bis = Cc["@mozilla.org/network/buffered-input-stream;1"].createInstance(Ci.nsIBufferedInputStream);
    bis.init(inputStream, 1024);

    var container = {};
    imageTools.decodeImageData(bis, mimeType, container);

    var encodedStream =
      imageTools.encodeScaledImage(container.value,
      this.getNativeIconMimeType(), container.value.width,
      container.value.height);

    outputStream.writeFrom(encodedStream, encodedStream.available());
    outputStream.close();
  },

  createNativeIconFromFile : function(file) {
    var inputStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
    inputStream.init(file, 0x01, 00004, null);

    var fileName = file.leafName;
    var fileExt = fileName.substring(fileName.lastIndexOf("."), fileName.length).toLowerCase();

    var mimeType = this.getMimeTypeFromExtension(fileExt);

    // The image decoders use ReadSegments, which isn't implemented on
    // file input streams. Use a buffered stream to make it work.
    var bis = Cc["@mozilla.org/network/buffered-input-stream;1"].
              createInstance(Ci.nsIBufferedInputStream);
    bis.init(inputStream, 1024);

    var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
    storageStream.init(4096, PR_UINT32_MAX, null);

    var bss = Cc["@mozilla.org/network/buffered-output-stream;1"].
              createInstance(Ci.nsIBufferedOutputStream);
    bss.init(storageStream.getOutputStream(0), 1024);

    this.createNativeIcon(bis, mimeType, bss);

    return storageStream;
  },

  getNativeIconExtension : function()
  {
    return ".ico";
  },

  getNativeIconMimeType : function()
  {
    return "image/vnd.microsoft.icon";
  },

  getNativeThrobberSpec : function()
  {
    return "chrome://global/skin/throbber/Throbber-small.gif";
  },

  getMimeTypeFromExtension : function(imageExt) {
    mimeSvc = Cc["@mozilla.org/mime;1"].getService(Ci.nsIMIMEService);
    imageExt = imageExt.toLowerCase();
    var dotPos = imageExt.lastIndexOf(".");
    if (dotPos != -1)
      imageExt = imageExt.substring(dotPos + 1, imageExt.length);
    return mimeSvc.getTypeFromExtension(imageExt);
  },

  makeDataURL : function(inputStream, mimetype) {
    var stream = Cc["@mozilla.org/binaryinputstream;1"].createInstance();
    stream.QueryInterface(Ci.nsIBinaryInputStream);
    stream.setInputStream(inputStream);

    var bytes = stream.readByteArray(stream.available()); // returns int[]

    return "data:" + mimetype + ";base64," + btoa(String.fromCharCode.apply(null, bytes));
  },

  createStorageStream : function()
  {
    var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
    storageStream.init(4096, PR_UINT32_MAX, null);
    return storageStream;
  },

  getBufferedOutputStream : function(storageStream)
  {
    var outputStream = storageStream.getOutputStream(0);
    var bufferedStream = Cc["@mozilla.org/network/buffered-output-stream;1"].
                         createInstance(Ci.nsIBufferedOutputStream);
    bufferedStream.init(outputStream, 1024);
    return bufferedStream;
  }
};
