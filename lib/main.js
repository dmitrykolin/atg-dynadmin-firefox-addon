var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageWorkers = require("sdk/page-worker");

var activateDynAdminUtilsButton = buttons.ActionButton({
  id: "atg-dynadmin-utils-link",
  label: "Dyn Admin Utils",
  icon: {
    "32": "./icon-dyn-admin-32.png"
  },
  onClick: handleActivateDynAdminUtilsButtonClick
});

function handleActivateDynAdminUtilsButtonClick(state) {
  injectDynAdminUtils();
}

function injectDynAdminUtils() {
  var activeTab = tabs.activeTab;
	var worker = tabs.activeTab.attach({
	  contentScriptFile: self.data.url("dynadmin-utils.js")
	});
  tabs.activeTab.on("ready", injectDynAdminUtilsContent);
}

function injectDynAdminUtilsContent() {
  var worker = tabs.activeTab.attach({
    contentScriptFile: self.data.url("dynadmin-utils.js")
  });
}

var { Hotkey } = require("sdk/hotkeys");

var injectUtilsHotkey = Hotkey({
	combo: "ctrl-alt-l",
	onPress: injectDynAdminUtils
});
