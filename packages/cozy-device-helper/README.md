# Cozy Device Helper

![NPM Licence shield](https://img.shields.io/npm/l/cozy-device-helper.svg)
[![npm](https://img.shields.io/npm/v/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)
[![npm](https://img.shields.io/npm/dt/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)

> This library allows to know more information about the device platform

## API

### Functions

<dl>
<dt><a href="#getDeviceName">getDeviceName()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getPlatform">getPlatform()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#isIOSApp">isIOSApp()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isAndroidApp">isAndroidApp()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isWebApp">isWebApp()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#isMobileApp">isMobileApp()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#hasDevicePlugin">hasDevicePlugin()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check for the Cordova device plugin</p>
</dd>
<dt><a href="#hasInAppBrowserPlugin">hasInAppBrowserPlugin()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check for the Cordova plugin InAppBrowser</p>
</dd>
<dt><a href="#hasSafariPlugin">hasSafariPlugin()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check for the Cordova SafariViewController plugin</p>
</dd>
</dl>

<a name="getDeviceName"></a>

### getDeviceName() ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - - Returns a string representing the name of the device (manufacturer and model)  
<a name="getPlatform"></a>

### getPlatform() ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - - Current platform ("ios", "android", "web")  
<a name="isIOSApp"></a>

### isIOSApp() ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - - Are we on iOS  
<a name="isAndroidApp"></a>

### isAndroidApp() ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - - Are we on Android  
<a name="isWebApp"></a>

### isWebApp() ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - - Current platform ("ios", "android", "web")  
<a name="isMobileApp"></a>

### isMobileApp() ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - - Are we on mobile, checks for Cordova presence  
<a name="hasDevicePlugin"></a>

### hasDevicePlugin() ⇒ <code>boolean</code>
Check for the Cordova device plugin

**Kind**: global function  
<a name="hasInAppBrowserPlugin"></a>

### hasInAppBrowserPlugin() ⇒ <code>boolean</code>
Check for the Cordova plugin InAppBrowser

**Kind**: global function  
<a name="hasSafariPlugin"></a>

### hasSafariPlugin() ⇒ <code>boolean</code>
Check for the Cordova SafariViewController plugin

**Kind**: global function  
