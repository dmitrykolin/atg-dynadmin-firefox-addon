function appendJSSrc(url) {
	var s = document.createElement('script');
	s.src = url;
	s.onload = function() {
	    //this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}

function appendCSSSrc(url) {
	var s = document.createElement('link');
	s.type = 'text/css';
	s.href = url;
	s.rel = "stylesheet"
	s.onload = function() {
	    //this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}

function appendJSInner(innerHTML) {
	var s = document.createElement('script');
	s.innerHTML = innerHTML;
	s.onload = function() {
	    //this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}

//firefox use self.options to pass function and arguments
if (typeof self.options != 'undefined') {
	window[self.options._function](self.options._argument);
}