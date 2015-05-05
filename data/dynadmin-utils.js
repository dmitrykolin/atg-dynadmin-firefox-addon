function isThisNotRepositoryPage() {
	return (document.querySelectorAll('body > a').length == 0 || document.querySelectorAll('body > a')[0].innerHTML != 'atg.adapter.gsa.GSARepository' || document.querySelector('h2') == null || document.querySelector('h2').innerHTML != "Examine the Repository, Control Debugging ");
}

var availableItemDescriptors = [];

function injectUtils() {
	availableItemDescriptors = [];

	if (isThisNotRepositoryPage()) {
		console.log('DynAdminUtils: not an atg repository ['+location.pathname+']');
		return;
	}

	console.log('DynAdminUtils: atg repository page ['+location.pathname+']');

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

	console.log('DynAdminUtils: injected');
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

if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
	exportFunction(printItem, unsafeWindow, {defineAs: "printItem"});
	exportFunction(printItemByURL, unsafeWindow, {defineAs: "printItemByURL"});
	exportFunction(queryItems, unsafeWindow, {defineAs: "queryItems"});
	exportFunction(addItem, unsafeWindow, {defineAs: "addItem"});

	exportFunction(printItemConsole, unsafeWindow, {defineAs: "printItemConsole"});
	exportFunction(queryItemsConsole, unsafeWindow, {defineAs: "queryItemsConsole"});
	exportFunction(addItemConsole, unsafeWindow, {defineAs: "addItemConsole"});

	exportFunction(openInvalidateCachePage, unsafeWindow, {defineAs: "openInvalidateCachePage"});
} else {

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