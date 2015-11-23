console.log('DynAdminUtils: chrome main...');

appendJSSrc(chrome.extension.getURL('/data/external/jquery-ui/external/jquery/jquery.js'));
appendJSSrc(chrome.extension.getURL('/data/external/jquery-ui/jquery-ui.js'));
appendCSSSrc(chrome.extension.getURL('/data/external/jquery-ui/jquery-ui.css'));

chrome.extension.sendRequest({storage: 'searchInjection'}, function(response) {
  if (response.storage == true || response.storage == "true" || response.storage == undefined) {
	chrome.extension.sendRequest({storage: 'realTimeSearch'}, function(response) {
	  if (response.storage == true || response.storage == "true" || response.storage == undefined) {
		appendJSInner("var realTimeSearchEnabled = true;");
	  }
	  appendJSSrc(chrome.extension.getURL('/data/dynadmin-search-utils.js'));
	  appendCSSSrc(chrome.extension.getURL('/data/dynadmin-search-utils.css'));
	});
  }
});

chrome.extension.sendRequest({storage: 'repositoryInjection'}, function(response) {
  if (response.storage == true || response.storage == "true" || response.storage == undefined) {
  	appendJSSrc(chrome.extension.getURL('/data/external/x2js/xml2json.min.js'));
  	appendJSSrc(chrome.extension.getURL('/data/external/handlebarsjs/handlebars-latest.js'));
  	appendJSInner("var itemDescriptorsPreviewTemplateURL = '" + chrome.extension.getURL('/data/itemDescriptorsPreviewTemplate.template') + "';");
	appendJSSrc(chrome.extension.getURL('/data/dynadmin-repository-utils.js'));
	appendCSSSrc(chrome.extension.getURL('/data/dynadmin-repository-utils.css'));
	
	appendJSSrc(chrome.extension.getURL('/data/external/highlight/highlight.pack.js'));
	appendCSSSrc(chrome.extension.getURL('/data/external/highlight/styles/default.css'));
  }
});