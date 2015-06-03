var searchComponentEndpoint = "/dyn/admin/atg/dynamo/admin/en/cmpn-search.jhtml";

function addAutoCompleteToComponentSearchField() {
	$.ajax({
      url: searchComponentEndpoint+"?query=",
      success: function( data ) {
      	var resultData = $('tr a', data).map(function() {
			var componentName = this.innerHTML.slice(this.innerHTML.lastIndexOf('/') + 1, this.innerHTML.length);
			var itemObject = {
	      			value: componentName,
	      			id: componentName,
	      			label: this.innerHTML
	      		};
	      	return itemObject;
		}).get();
		addAutoComplete(resultData);
      }
    });
}

function addAutoComplete(sourceFunction) {
	$( "#searchField, input[name='query']" ).after('<a class="remove-dyn-admin-utils-search-button" href="#" onclick="removeDynAdminUtilsSearch(); return false;">remove dyn-admin utils autocomplete</a>');
	$(".remove-dyn-admin-utils-search-button").attr("title", "You can disable this feature in plugin options section");
	$( "#searchField, input[name='query']" ).autocomplete({
      source: sourceFunction,
      minLength: 0,
      select: function( event, ui ) {
      	var url = location.protocol + '//' + location.host + "/dyn/admin/nucleus" + ui.item.label
      	window.location.href = url;
        return true;
      }
    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a>" + item.value + "<br>" + "<p>" + item.label + "</p>" + "</a>" )
        .appendTo( ul );
    };
}

function addRealtimeAutoCompleteToComponentSearchField() {
	addAutoComplete(function( request, response ) {
        $.ajax({
          url: searchComponentEndpoint+"?query="+request.term,
          success: function( data ) {
			var resultData = $('tr a', data).map(function() {
				var componentName = this.innerHTML.slice(this.innerHTML.lastIndexOf('/') + 1, this.innerHTML.length);
				var itemObject = {
		      			value: componentName,
		      			id: componentName,
		      			label: this.innerHTML
		      		};
		      	return itemObject;
			}).get();

            response( resultData );
          }
        });
    });
}

if (typeof realTimeSearchEnabled != 'undefined' && realTimeSearchEnabled == true) {
	console.log('DynAdminUtils: real-time search injected ['+location.pathname+']');
	window.setTimeout(addRealtimeAutoCompleteToComponentSearchField, 200);
} else {
	console.log('DynAdminUtils: search injected ['+location.pathname+']');
	window.setTimeout(addAutoCompleteToComponentSearchField, 200);
}

function removeDynAdminUtilsSearch() {
	$(".remove-dyn-admin-utils-search-button").remove();
	$( "#searchField, input[name='query']" ).autocomplete("destroy");
}