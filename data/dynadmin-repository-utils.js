function isThisNotRepositoryPage() {
	return (document.querySelectorAll('body > a').length == 0 || document.querySelectorAll('body > a')[0].innerHTML != 'atg.adapter.gsa.GSARepository' || document.querySelector('h2') == null || document.querySelector('h2').innerHTML != "Examine the Repository, Control Debugging ");
}

function isRepositoryPage() {
	return (document.querySelectorAll('body > a').length > 0 && (document.querySelectorAll('body > a')[0].innerHTML == 'atg.adapter.gsa.GSARepository' || document.querySelectorAll('body > a')[0].innerHTML == 'atg.adapter.version.VersionRepository'));
}

function isRepositoryItemsView() {
	return (document.querySelectorAll('h2').length > 0 && document.querySelector('h2').innerHTML == "Examine the Repository, Control Debugging ");
}

function isRepositoryDefinitionFilesView() {
	return (document.querySelectorAll('h1').length > 1 && document.querySelectorAll('h1')[1].innerHTML == "Property definitionFiles");
}

var availableItemDescriptors = [];

function injectUtils() {
	availableItemDescriptors = [];

	if (!isRepositoryPage()) {
		console.log('DynAdminUtils: not an atg repository ['+location.pathname+']');
		return;
	}

	console.log('DynAdminUtils: atg repository page ['+location.pathname+']');

	if (isRepositoryItemsView()) {
		injectRepositoryItemsViewUtils();
	} else if (isRepositoryDefinitionFilesView()) {
		injectRepositoryDefinitionFilesViewUtils();
	}

	console.log('DynAdminUtils: injected');
}

function injectRepositoryItemsViewUtils() {
	var itemDescriptorTable = document.querySelectorAll('table')[0];
	var tableHeaderCell = itemDescriptorTable.querySelector('tr td');

	if (tableHeaderCell.innerHTML == "Dyn Admin Utils injected") {
		console.log('DynAdminUtils: already injected');
		return;	
	}

	tableHeaderCell.style["color"] = "white";
	tableHeaderCell.style["background-color"] = "blue";
	tableHeaderCell.style["text-align"] = "center";
	tableHeaderCell.style["font-weight"] = "bold";
	tableHeaderCell.innerHTML = "Dyn Admin Utils injected";
	
	addUtilLinksForItemDescriptors(itemDescriptorTable);
	addUtilLinksForRQLConsoleTextArea();
}

function injectRepositoryDefinitionFilesViewUtils() {
	if (document.querySelectorAll('table').length < 2) {
		return;
	}

	var definitionsTable = document.querySelectorAll('table')[1];
	var definitionArray = definitionsTable.querySelectorAll('table pre');

	var x2js = new X2JS();
	var templateSource = '';
	$.ajax({
		url: itemDescriptorsPreviewTemplateURL,
		async: true,
		success: function (response) {
			templateSource = response;
			
			var timeoutV = 0;
			if (!window.Handlebars) {
				timeoutV = 1000;
			}

			window.definitionStorage = {};

			setTimeout(function() {
				var template = Handlebars.compile(templateSource);

				Handlebars.registerHelper('inc', function(context) {
				  return parseInt(context) + 1;
				});

				Handlebars.registerHelper('ifNotEmpty', function(context, options) {
				  if (context && context != '') {
				  	return options.fn(context);
				  } else {
				    options.inverse(this);
				  }
				});

				Handlebars.registerHelper('eachEx', function(contextArrayOrSingleItem, options) {
					var ret = "";

					if (options.data) {
						data = Handlebars.createFrame(options.data);
					}

					if (!contextArrayOrSingleItem) {
						return;
					} else if (contextArrayOrSingleItem.length) {
						for (var i = 0; i < contextArrayOrSingleItem.length; i++) {
							if (data) {
								data.index = i;
							}
							ret = ret + options.fn(contextArrayOrSingleItem[i], { data: data });
						}
					} else {
						if (data) {
							data.index = 0;
						}
						ret = ret + options.fn(contextArrayOrSingleItem, { data: data });
					}
					return ret;
				});

				for (var i = 0; i < definitionArray.length; i++) {
					var definitionXMLDesctiption = definitionArray[i];
					definitionXMLDesctiption.className = definitionXMLDesctiption.className + " xmlDefinitionHidden";
					var definitionItemViewContainer = definitionXMLDesctiption.parentElement;
					var repositoryDefinitionObject = x2js.xml_str2json(definitionXMLDesctiption.textContent);
					repositoryDefinitionObject['index'] = i;
					repositoryDefinitionObject['xmlDocument'] = jQuery.parseXML( definitionXMLDesctiption.textContent );
					repositoryDefinitionObject['xmlText'] = definitionXMLDesctiption.textContent;
					console.log(repositoryDefinitionObject);
					window.definitionStorage['definition_' + i] = repositoryDefinitionObject;

					var html = template(repositoryDefinitionObject);
					var definitionPreview = html;

					definitionItemViewContainer.parentElement.querySelector('td').insertAdjacentHTML('beforeend', '<div class="show_xml_button_container"><br/><br/><br/>Preview mode activated<br/><br/>' + getShowXMLDefinitionViewLink() + '</div>');
					definitionItemViewContainer.insertAdjacentHTML('beforeend', definitionPreview);
				}
			}, timeoutV);
		}
	});	
}

function addUtilLinksForItemDescriptors(itemDescriptorTable) {
	var itemDescriptorRows = itemDescriptorTable.querySelectorAll("tr");
	for (var i = 2; i < itemDescriptorRows.length; i++) {
	  processItemDescriptors(itemDescriptorRows.item(i));
	}
}

function addUtilLinksForRQLConsoleTextArea() {
	var rqlConsoleTextArea = document.querySelectorAll('textarea')[0];
	var parentContainer = rqlConsoleTextArea.parentElement;
	//TODO: add links into parentContainer before rqlConsoleTextArea
	var consoleUtilLinksString = "<div>";
	consoleUtilLinksString += getPrintItemConsoleLink() + " | ";
	consoleUtilLinksString += getQueryItemsConsoleLink() + " | ";
	consoleUtilLinksString += getAddItemConsoleLink();

	consoleUtilLinksString += "<select id=\"availableItemDescriptors\" style=\"margin-left: 20px;\">";
	var i=0;
	for (i = 0; i<availableItemDescriptors.length; i++) {
		consoleUtilLinksString += "<option>"+availableItemDescriptors[i]+"</option>";
	}
	consoleUtilLinksString += "</select>";
	consoleUtilLinksString += "</div>";

	parentContainer.insertAdjacentHTML('afterbegin', consoleUtilLinksString);
}

function processItemDescriptors(itemDescriptorsRow) {
	var itemDescriptorName = getItemDescriptorName(itemDescriptorsRow);
	availableItemDescriptors.push(itemDescriptorName);
	var linksString = "<th>";
	linksString += getPrintItemLink(itemDescriptorName) + " | ";
	linksString += getPrintItemByURLLink(itemDescriptorName) + " | ";
	linksString += getQueryItemsLink(itemDescriptorName) + " | ";
	linksString += getAddItemLink(itemDescriptorName);
	linksString += "</th>";
	var thElement = document.createElement("th");
	
	itemDescriptorsRow.insertAdjacentHTML('afterbegin', linksString);
}


function getPrintItemConsoleLink() {
	return generateLinkItem("print", "printItemConsole();");
}

function getQueryItemsConsoleLink() {
	return generateLinkItem("query", "queryItemsConsole();");
}

function getAddItemConsoleLink() {
	return generateLinkItem("add", "addItemConsole();");
}

function getPrintItemLink(itemDescriptorName) {
	return generateLinkItem("print", "printItem('"+itemDescriptorName+"');");
}

function getPrintItemByURLLink(itemDescriptorName) {
	return generateLinkItem("print by url", "printItemByURL('"+itemDescriptorName+"');");
}

function getQueryItemsLink(itemDescriptorName) {
	return generateLinkItem("query", "queryItems('"+itemDescriptorName+"');");
}

function getAddItemLink(itemDescriptorName) {
	return generateLinkItem("add", "addItem('"+itemDescriptorName+"');");
}

function getShowXMLDefinitionViewLink() {
	return generateLinkItem("Show XML", "showXMLDefinitionView(this);");
}

function generateLinkItem(name, functionCall) {
	return "<a href=\"#\" onclick=\""+functionCall+" return false;\">"+name+"</a>";
}

printItemConsole = function () {
	var itemDescriptorName = getSelectedItemDescriptor();
	var id = prompt("Please enter ID", "id");	
	getRQLConsoleTextArea().value = getPringItemConsoleText(itemDescriptorName, id);
	focusSubmitButton();
}

queryItemsConsole = function () {
	var itemDescriptorName = getSelectedItemDescriptor();
	getRQLConsoleTextArea().value = getQueryItemsConsoleText(itemDescriptorName);
	focusSubmitButton();
}

addItemConsole = function () {
	var itemDescriptorName = getSelectedItemDescriptor();
	var id = prompt("Please enter ID", "id");
	getRQLConsoleTextArea().value = getAddItemConsoleText(itemDescriptorName, id);
	focusSubmitButton();
}

printItem = function (itemDescriptorName) {
	var id = prompt("Please enter ID", "id");
	getRQLConsoleTextArea().value = getPringItemConsoleText(itemDescriptorName, id);
	focusSubmitButton();
}

printItemByURL = function (itemDescriptorName) {
	var id = prompt("Please enter ID", "id");
	var url = location.protocol + '//' + location.host + location.pathname + "?action=seeitems&itemdesc="+itemDescriptorName+"&itemid="+id+"#seeItems";
	window.location.href = url;
}

queryItems = function (itemDescriptorName) {
	getRQLConsoleTextArea().value = getQueryItemsConsoleText(itemDescriptorName);
	focusSubmitButton();
}

showXMLDefinitionView = function (element) {
	var labelContainer = element.parentElement.parentElement;
	var contentContainer = labelContainer.parentElement.querySelectorAll('td')[1];
	
	var previewContainer = contentContainer.querySelector('.preview-container');
	previewContainer.remove();

	var xmlDefinitionPre = contentContainer.querySelector('.xmlDefinitionHidden');
	xmlDefinitionPre.className = xmlDefinitionPre.className.replace('xmlDefinitionHidden', '');

	element.parentElement.remove();
}

showData = function (element) {
	var index = $(element).parents('.preview-container').attr('index');
	var selectedDefinition = window.definitionStorage['definition_' + index];

	var it = $(element).parents('.xml-path');
	var path = '';
	while (it.size() > 0) {
		path = it.attr('path') + path;
		it = $(it).parents('.xml-path');
	}

	var resultObject = $(selectedDefinition.xmlDocument).xpathEvaluate(path);
	var resultItem = resultObject[0];

	var xmlS = new XMLSerializer()
	var resultText = xmlS.serializeToString(resultItem);

	var dialogElement = document.createElement("pre");
	dialogElement.setAttribute("class","xml-content-popup");

	var dialogTextareaElement = document.createElement("code");
	dialogElement.appendChild(dialogTextareaElement);
	
	var dialogText = document.createTextNode(resultText);
	dialogTextareaElement.appendChild(dialogText);

	hljs.highlightBlock(dialogTextareaElement);

	$(dialogElement).dialog({
      modal: true,
      title: 'XML View',
      closeOnEscape: true,
      draggable: false,
      dialogClass: "xml-view-dialog",
      beforeClose: function( event, ui ) {dialogElement.remove()},
      buttons: {
      }
    });
}

addItem = function (itemDescriptorName) {
	var id = prompt("Please enter ID", "id");
	getRQLConsoleTextArea().value = getAddItemConsoleText(itemDescriptorName, id);
	focusSubmitButton();
}

function getPringItemConsoleText(itemDescriptorName, id) {
	return "<print-item item-descriptor=\""+itemDescriptorName+"\" id=\""+id+"\"/>";
}

function getQueryItemsConsoleText(itemDescriptorName) {
	return "<query-items item-descriptor=\""+itemDescriptorName+"\">\n\rALL RANGE +5\n\r</query-items>";
}

function getAddItemConsoleText(itemDescriptorName, id) {
	return "<add-item item-descriptor=\""+itemDescriptorName+"\" id=\""+id+"\">\n\r<set-property name=\"PROPERTY_NAME\"><![CDATA[VALUE]]></set-property>\n\r</add-item>";
}

function getItemDescriptorName(rowElement) {
	var itemDescriptorElement = rowElement.querySelectorAll('th')[0];
	var itemDescriptorValue = itemDescriptorElement.innerHTML;
	return itemDescriptorValue;
}

function getRQLConsoleTextArea() {
	var rqlConsoleArea = document.querySelectorAll('textarea')[0];
	return rqlConsoleArea;
}

function getSelectedItemDescriptor() {
	return document.getElementById("availableItemDescriptors").value;
}

openInvalidateCachePage = function () {
	var url = location.protocol + '//' + location.host + location.pathname + "?shouldInvokeMethod=invalidateCaches";
	window.open(url, "Invalidate Cache");
}

focusSubmitButton = function () {
	var submitButton = getSubmitButton();
	submitButton.focus();
	submitButton.select();
}

getSubmitButton = function() {
	return document.querySelector('input[type="submit"]');
}

if (location.pathname.indexOf("/dyn/admin/") == 0) {
	injectUtils();
}

// define a handler
function doc_keyUp(e) {

    if (e.ctrlKey && e.altKey && e.keyCode == 73) {
        openInvalidateCachePage();
    }
}

document.addEventListener('keyup', doc_keyUp, false);

$.fn.xpathEvaluate = function (xpathExpression) {
   // NOTE: vars not declared local for debug purposes
   $this = this.first(); // Don't make me deal with multiples before coffee

   // Evaluate xpath and retrieve matching nodes
   xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

   result = [];
   while (elem = xpathResult.iterateNext()) {
      result.push(elem);
   }

   $result = jQuery([]).pushStack( result );
   return $result;
}