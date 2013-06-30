function makeHttpObject() {
try {return new XMLHttpRequest();}
catch (error) {}
try {return new ActiveXObject("Msxml2.XMLHTTP");}
catch (error) {}
try {return new ActiveXObject("Microsoft.XMLHTTP");}
catch (error) {}
throw new Error("Could not create HTTP request object.");
}
typeof(makeHttpObject());

var request = makeHttpObject();
request.open("GET", "http://localhost/t.txt", false);//false - not asynchronous
request.send(null);
print(request.responseText);

request.open("GET", "files/fruit.xml", true);
request.send(null);
request.onreadystatechange = function() {
	if (request.readyState == 4)
		show(request.responseText.length);
};



function serializeJSON(value) {
	function isArray(value) {
		return /^\s*function Array/.test(String(value.constructor));
	}
	function serializeArray(value) {
		console.log("serializeArray");
		return "[" + map(serializeJSON, value).join(", ") + "]";
	}
	function serializeObject(value) {
		console.log("serializeObj");
		var properties = [];
		forEachIn(value, function(name, value) {
			properties.push(serializeString(name) + ": " +
			serializeJSON(value));
		});
		return "{" + properties.join(", ") + "}";
	}
	function serializeString(value) {
			console.log("serializeString");
		var special =
			{"\"": "\\\"", "\\": "\\\\", "\f": "\\f", "\b": "\\b",
			"\n": "\\n", "\t": "\\t", "\r": "\\r", "\v": "\\v"};
			var escaped = value.replace(/[\"\\\f\b\n\t\r\v]/g,
			function(c) {return special[c];});
			return "\"" + escaped + "\"";
		}
		var type = typeof value;
		if (type == "object" && isArray(value))
			return serializeArray(value);
		else if (type == "object")
			return serializeObject(value);
		else if (type == "string")
			return serializeString(value);
		else
			return String(value);
		}
		console.log(serializeJSON(fruit));

//wrapper

function simpleHttpRequest(url, success, failure) {
var request = makeHttpObject();
request.open("GET", url, true);
request.send(null);
request.onreadystatechange = function() {
	if (request.readyState == 4) {
		if (request.status == 200)
			success(request.responseText);
		else if (failure)
			failure(request.status, request.statusText);
		}
	};	
}
simpleHttpRequest("files/fruit.txt", console.log);