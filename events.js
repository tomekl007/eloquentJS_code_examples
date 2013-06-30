
function $(id) {
	return document.getElementById(id);
}

$("send").addEventListener("click", function(){print("Click!");},
false);

function registerEventHandler(node, event, handler) {
if (typeof node.addEventListener == "function")
	node.addEventListener(event, handler, false);
else
	node.attachEvent("on" + event, handler);
}

function unregisterEventHandler(node, event, handler) {
if (typeof node.removeEventListener == "function")
	node.removeEventListener(event, handler, false);
else
	node.detachEvent("on" + event, handler);
}

registerEventHandler($("button"), "click",
						function(){print("Click (2)");});

function showEvent(event) {
	show(event || window.event);
}
registerEventHandler($("textfield"), "keypress", showEvent);

unregisterEventHandler($("textfield"), "keypress", showEvent);

function reportClick(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	var pageX = event.pageX, pageY = event.pageY;
	if (pageX == undefined) {
		pageX = event.clientX + document.body.scrollLeft;
		pageY = event.clientY + document.body.scrollTop;
	}
	print("Mouse clicked at ", pageX, ", ", pageY,
	". Inside element:");
	console.log(target);
}
registerEventHandler(document, "click", reportClick);

unregisterEventHandler(document, "click", reportClick);

function printKeyCode(event) {
	event = event || window.event;
	console.log("Key ", event.keyCode, " was pressed.");
}
registerEventHandler($("textfield"), "keydown", printKeyCode);


function printCharacter(event) {
event = event || window.event;
var charCode = event.charCode;
if (charCode == undefined || charCode === 0)
	charCode = event.keyCode;
console.log("Character '", String.fromCharCode(charCode), "'");
}

registerEventHandler($("textfield"), "keypress", printCharacter);



function normaliseEvent(event) {
if (!event.stopPropagation) {
	event.stopPropagation = function() {this.cancelBubble = true;};
	event.preventDefault = function() {this.returnValue = false;};
}
if (!event.stop) {
	event.stop = function() {
	this.stopPropagation();
	this.preventDefault();
	};
}
if (event.srcElement && !event.target)
	event.target = event.srcElement;
if ((event.toElement || event.fromElement) && !event.relatedTarget)
	event.relatedTarget = event.toElement || event.fromElement;
if (event.clientX != undefined && event.pageX == undefined) {
	event.pageX = event.clientX + document.body.scrollLeft;
	event.pageY = event.clientY + document.body.scrollTop;
}
if (event.type == "keypress") {
	if (event.charCode === 0 || event.charCode == undefined)
		event.character = String.fromCharCode(event.keyCode);
	else
		event.character = String.fromCharCode(event.charCode);
}
return event;
}

//wrapper

function addHandler(node, type, handler) {
	function wrapHandler(event) {
		handler(normaliseEvent(event || window.event));
	}
	registerEventHandler(node, type, wrapHandler);
	return {node: node, type: type, handler: wrapHandler};
}
function removeHandler(object) {
	unregisterEventHandler(object.node, object.type, object.handler);
}
var blockQ = addHandler($("textfield"), "keypress", function(event) {
	if (event.character.toLowerCase() == "q")
		event.stop();
});


//sokoban
var Square = {
	construct: function(character, tableCell) {
		this.background = "empty";
		if (character == "#")
			this.background = "wall";
		else if (character == "*")
			this.background = "exit";
			this.tableCell = tableCell;
			this.tableCell.className = this.background;
			this.content = null;
		if (character == "0")
			this.content = "boulder";
		else if (character == "@")
			this.content = "player";
		if (this.content != null) {
			var image = dom("IMG", {src: "img/sokoban/" +
			this.content + ".gif"});
			this.tableCell.appendChild(image);
		}	
	},
		hasPlayer: function() {
			return this.content == "player";
		},
		hasBoulder: function() {
			return this.content == "boulder";
		},
		isEmpty: function() {
			return this.content == null && this.background == "empty";
		},
		isExit: function() {
			return this.background == "exit";
		}	
};
var testSquare = Square.create("@", dom("TD"));
testSquare.hasPlayer();


Square.moveContent = function(target) {
	target.content = this.content;
	this.content = null;
	target.tableCell.appendChild(this.tableCell.lastChild);
};
Square.clearContent = function() {
	this.content = null;
	removeElement(this.tableCell.lastChild);
};