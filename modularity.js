function buildMonthNameModule() {
	var names = ["January", "February", "March", "April",
				"May", "June", "July", "August", "September",
				"October", "November", "December"];
	function getMonthName(number) {
		return names[number];
	}
	function getMonthNumber(name) {
		for (var number = 0; number < names.length; number++) {
			if (names[number] == name)
				return number;
		}
	}
window.getMonthName = getMonthName;
window.getMonthNumber = getMonthNumber;
}
buildMonthNameModule();
getMonthName(11);

//or
function provide(values) {
	forEachIn(values, function(name, value) {
		window[name] = value;
	});
}

(function() {
	var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
				"Thursday", "Friday", "Saturday"];
	provide({
		getDayName: function(number) {
			return names[number];
		},
		getDayNumber: function(name) {
			for (var number = 0; number < names.length; number++) {
				if (names[number] == name)
					return number;
			}
		}
	});
})();
console.log(getDayNumber("Wednesday"));



//---------------------------------------
function defaultTo(object, values) {
	forEachIn(values, function(name, value) {
		if (!object.hasOwnProperty(name)){
			console.log(name + " : " + value);
			object[name] = value;
		}
	});
}

function range(args) {
	defaultTo(args, {start: 0, stepSize: 1});
	if (args.end == undefined)
		args.end = args.start + args.stepSize * (args.length - 1);
	var result = [];
	for (; args.start <= args.end; args.start += args.stepSize)
		result.push(args.start);
	return result;
}
console.log(range({stepSize: 4, length: 5}));

//chapter 10 ----------------------------------------
var encoded = encodeURIComponent("aztec empire");
encoded;
decodeURIComponent(encoded);

//chapter 11-----------------------------------------

function isImage(node) {
	return !isTextNode(node) && node.nodeName == "IMG";
}

function isTextNode(node) {
	return node.nodeType == 3;
}


function map(func, array) {
var result = [];
	forEach(array, function (element) {
		result.push(func(element));
	});
	return result;
}

function forEach(array, action) {
	for (var i = 0; i < array.length; i++)
		action(array[i]);
}

function forEachIn(object, action) {
	for (var property in object) {
		if (Object.prototype.hasOwnProperty.call(object, property))
			action(property, object[property]);
	}
}


function escapeHTML(text) {
var replacements = {"<": "&lt;", ">": "&gt;",
					"&": "&amp;", "\"": "&quot;"};
	return text.replace(/[<>&"]/g, function(character) {
		return replacements[character];
	});
}

function asHTML(node) {
	if (isTextNode(node))
		return escapeHTML(node.nodeValue);
	else if (node.childNodes.length == 0)
		return "<" + node.nodeName + "/>";
	else
		return "<" + node.nodeName + ">" +
				map(asHTML, node.childNodes).join("") +
				"</" + node.nodeName + ">";
}
console.log(asHTML(document.body));


//interpreted as plain text
document.body.firstChild.firstChild.nodeValue =
"Chapter 1: The deep significance of the bottle";
//interpeted as html
document.body.firstChild.innerHTML =
"Did you know the 'blink' tag yet? <blink>Joy!</blink>";


function $(id) {
return document.getElementById(id);
}
console.log($("picture"));

(document.body.getElementsByTagName("BLINK")[0]);

var secondHeader = document.createElement("H1");
var secondTitle = document.createTextNode("Chapter 2: Deep magic");

secondHeader.appendChild(secondTitle);
document.body.appendChild(secondHeader);

var newImage = document.createElement("IMG");
newImage.setAttribute("src", "img/Hiva Oa.png");
document.body.appendChild(newImage);
show(newImage.getAttribute("src"));

function setNodeAttribute(node, attribute, value) {
	if (attribute == "class")
		node.className = value;
	else if (attribute == "checked")
		node.defaultChecked = value;
	else if (attribute == "for")
		node.htmlFor = value;
	else if (attribute == "style")
		node.style.cssText = value;
	else
		node.setAttribute(attribute, value);
}

function dom(name, attributes) {
	var node = document.createElement(name);
	if (attributes) {
		forEachIn(attributes, function(name, value) {
			setNodeAttribute(node, name, value);
		});
	}
	for (var i = 2; i < arguments.length; i++) {
		var child = arguments[i];
		if (typeof child == "string")
			child = document.createTextNode(child);
		node.appendChild(child);
	}
	return node;
}
var newParagraph =
dom("P", null, "A paragraph with a ",
dom("A", {href: "http://en.wikipedia.org/wiki/Alchemy"},
			"link"),
			" inside of it.");
document.body.appendChild(newParagraph);

var link = newParagraph.childNodes[1];
newParagraph.insertBefore(dom("STRONG", null, "great "), link);

newParagraph.replaceChild(document.createTextNode("lousy "),
newParagraph.childNodes[1]);

newParagraph.removeChild(newParagraph.childNodes[1]);

function removeElement(node) {
if (node.parentNode)
	node.parentNode.removeChild(node);
}

removeElement(newParagraph);

function makeTable(data, columns) {
var headRow = dom("TR");
	forEach(columns, function(name) {
		headRow.appendChild(dom("TH", null, name));
	});
var body = dom("TBODY", null, headRow);
	forEach(data, function(object) {
		var row = dom("TR");
		forEach(columns, function(name) {
			row.appendChild(dom("TD", null, String(object[name])));
		});
	body.appendChild(row);
	});
	return dom("TABLE", null, body);
}
var table = makeTable(document.body.childNodes,
["nodeType", "tagName"]);
document.body.appendChild(table);

$("picture").style.position = "absolute";
	var angle = 0;
	var spin = setInterval(function() {
	angle += 0.1;
	$("picture").style.left = (100 + 100 * Math.cos(angle)) + "px";
	$("picture").style.top = (100 + 100 * Math.sin(angle)) + "px";
}, 100);