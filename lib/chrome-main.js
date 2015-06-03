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
	appendJSSrc(chrome.extension.getURL('/data/dynadmin-repository-utils.js'));
  }
});