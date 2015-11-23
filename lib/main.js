//Firefox start point
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageWorkers = require("sdk/page-worker");
var simplePrefs = require("sdk/simple-prefs");

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
  console.log('injectDynAdminUtils');
	/*var worker = tabs.activeTab.attach({
	  contentScriptFile: self.data.url("dynadmin-utils.js")
	});*/
  injectDynAdminUtilsContent();
  //tabs.activeTab.on("ready", injectDynAdminUtilsContent);
}

var injectionUtilsUrl = self.data.url("injection-utils.js");

function injectDynAdminUtilsContent() {
  console.log("injectDynAdminUtilsContent");
  tabs.activeTab.attach({
    contentScriptFile: [self.data.url("external/jquery-ui/external/jquery/jquery.js")]
  });
  tabs.activeTab.attach({
    contentScriptFile: injectionUtilsUrl,
    contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("external/jquery-ui/external/jquery/jquery.js")}
  });
  tabs.activeTab.attach({
    contentScriptFile: injectionUtilsUrl,
    contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("external/jquery-ui/jquery-ui.js")}
  });
  tabs.activeTab.attach({
    contentScriptFile: injectionUtilsUrl,
    contentScriptOptions: {"_function": "appendCSSSrc", "_argument": self.data.url("external/jquery-ui/jquery-ui.css")}
  });

  if (simplePrefs.prefs.repositoryInjection) {
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("external/x2js/xml2json.min.js")}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("external/handlebarsjs/handlebars-latest.js")}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSInner", "_argument": "var itemDescriptorsPreviewTemplateURL = '" + chrome.extension.getURL('/data/itemDescriptorsPreviewTemplate.template') + "';"}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("dynadmin-repository-utils.js")}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendCSSSrc", "_argument": self.data.url("dynadmin-repository-utils.css")}
    });

    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("external/highlight/highlight.pack.js")}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendCSSSrc", "_argument": self.data.url("/=external/highlight/styles/default.css")}
    });
  }
  if (simplePrefs.prefs.searchInjection) {
    if (simplePrefs.prefs.realTimeSearch) {
      tabs.activeTab.attach({
        contentScriptFile: injectionUtilsUrl,
        contentScriptOptions: {"_function": "appendJSInner", "_argument": "var realTimeSearchEnabled = true;"}
      });
    }
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendJSSrc", "_argument": self.data.url("dynadmin-search-utils.js")}
    });
    tabs.activeTab.attach({
      contentScriptFile: injectionUtilsUrl,
      contentScriptOptions: {"_function": "appendCSSSrc", "_argument": self.data.url("dynadmin-search-utils.css")}
    });
  }
}

var { Hotkey } = require("sdk/hotkeys");

var injectUtilsHotkey = Hotkey({
	combo: "ctrl-alt-l",
	onPress: injectDynAdminUtils
});