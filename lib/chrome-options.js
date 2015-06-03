var defaultSearchInjection = true;
var defaultRealTimeSearch = true;
var defaultRepositoryInjection = true;

function loadOptions() {
	var _searchInjection = localStorage["searchInjection"];
	var _realTimeSearch = localStorage["realTimeSearch"];
	var _repositoryInjection = localStorage["repositoryInjection"];

	if (_searchInjection == undefined) {
		_searchInjection = defaultSearchInjection;
	}

	if (_realTimeSearch == undefined) {
		_realTimeSearch = defaultRealTimeSearch;
	}

	if (_repositoryInjection == undefined) {
		_repositoryInjection = defaultRepositoryInjection;
	}

	if (_searchInjection == "true" || _searchInjection == true) {
		$('#searchInjection').prop('checked', true);
		$('#realTimeSearch').removeAttr("disabled");
	} else {
		$('#searchInjection').prop('checked', false);
		$('#realTimeSearch').attr("disabled", true);
	}
	$('#searchInjection').change(function() {
        if($(this).is(":checked")) {
            $('#realTimeSearch').removeAttr("disabled");
        } else {
			$('#realTimeSearch').attr("disabled", true);
        }
    });

	if (_realTimeSearch == "true" || _realTimeSearch == true) {
		$('#realTimeSearch').prop('checked', true);
	} else {
		$('#realTimeSearch').prop('checked', false);
	}

	$('#repositoryInjection').prop('checked', _repositoryInjection == "true" || _repositoryInjection == true);

	$("#saveButton").click(saveOptions);
	$("#eraseButton").click(eraseOptions);
}

function saveOptions() {
	localStorage["searchInjection"] = $('#searchInjection').prop('checked');
	localStorage["repositoryInjection"] = $('#repositoryInjection').prop('checked');
	localStorage["realTimeSearch"] = $('#realTimeSearch').prop('checked');
}

function eraseOptions() {
	localStorage.removeItem("searchInjection");
	localStorage.removeItem("repositoryInjection");
	localStorage.removeItem("realTimeSearch");
	location.reload();
}

$(document).ready(function(){
	loadOptions();
});