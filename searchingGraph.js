var roads = {};
function makeRoad(from, to, length) {
	function addRoad(from, to) {
		if (!(from in roads))
			roads[from] = [];
			roads[from].push({to: to, distance: length});
}
	addRoad(from, to);
	addRoad(to, from);
}
/*
function makeRoads(from, arrayOfPairs){
	for(var i = 0; i < arrayOfPairs.length ; i+=2){
		alert(arrayOfPairs[i]);
		makeRoad(from,arrayOfPairs[i],arrayOfPairs[i + 1]);
	}
}*/

function makeRoads(start) {
	for (var i = 1; i < arguments.length; i += 2)
		makeRoad(start, arguments[i], arguments[i + 1]);
}

function roadsFrom(place) {
var found = roads[place];
	if (found == undefined)
		throw new Error("No place named '" + place + "' found.");
	else
		return found;
}

makeRoads("Point Kiukiu", "Hanaiapa", 19,
"Mt Feani", 15, "Taaoa", 15);
makeRoads("Airport", "Hanaiapa", 6, "Mt Feani", 5,
"Atuona", 4, "Mt Ootua", 11);
makeRoads("Mt Temetiu", "Mt Feani", 8, "Taaoa", 4);
makeRoads("Atuona", "Taaoa", 3, "Hanakee pearl lodge", 1);
makeRoads("Cemetery", "Hanakee pearl lodge", 6, "Mt Ootua", 5);
makeRoads("Hanapaoa", "Mt Ootua", 3);
makeRoads("Puamua", "Mt Ootua", 13, "Point Teohotepapapa", 14);
roads["Airport"];


function gamblerPath(from, to) {
	function randomInteger(below) {
		return Math.floor(Math.random() * below);
	}
	function randomDirection(from) {
		var options = roadsFrom(from);
		return options[randomInteger(options.length)].to;
	}	
	var path = [];
	while (true) {
		path.push(from);
		if (from == to)
			break;
		from = randomDirection(from);
	}
	return path;
	}
gamblerPath("Hanaiapa", "Mt Feani");




var Break = {toString: function() {return "Break";}};


//which is used to determine whether an element is found within an array.
function member(array, value) {
	var found = false;
		forEach(array, function(element) {
		if (element === value)
			found = true;
			//throw Break;
		});
	return found;
}

//for each with break

function forEach(array, action) {
	try {
		for (var i = 0; i < array.length; i++)
			action(array[i]);
		}
	catch (exception) {
		if (exception != Break)
			throw exception;
	}
}

function any(test, array) {
for (var i = 0; i < array.length; i++) {
	var found = test(array[i]);
		if (found)
		return found;
	}
return false;
}

function every(test, array) {
	for (var i = 0; i < array.length; i++) {
		var found = test(array[i]);
		if (!found)
			return found;
	}
return true;
}

function flatten(arrays) {
var result = [];
	forEach(arrays, function (array) {
		forEach(array, function (element){result.push(element);});
	});
return result;
}

function filter(predicate, array){
	var result = [];
	forEach(array, function(element){
		if(predicate(element))
		 result.push(element);
	});
	return result;	
}

function map(func, array) {
var result = [];
	forEach(array, function (element) {
		result.push(func(element));
	});
	return result;
}

//finding way
function possibleRoutes(from, to) {
	function findRoutes(route) {
		function notVisited(road) {
			return !member(route.places, road.to);
		}
		function continueRoute(road) {
			return findRoutes({places: route.places.concat([road.to]),
			length: route.length + road.distance});
		}
		var end = route.places[route.places.length - 1];
		if (end == to)
			return [route];
		else
			return flatten(map(continueRoute, filter(notVisited,
			roadsFrom(end))));
	}
	return findRoutes({places: [from], length: 0});
}
possibleRoutes("Point Teohotepapapa", "Point Kiukiu").length;
possibleRoutes("Hanapaoa", "Mt Ootua");


//bad implementanion
function findShortestPath(from, to){
	var allRoutes = possibleRoutes(from,to);
	var currentLength = 1000;
	var findLowestLength = function(length){
		if(length < currentLength)
			currentLength = length;
	}
	filter(findLowestLength,allRoutes );
}
findShortestPath("Point Teohotepapapa", "Point Kiukiu");

function shortestRoute(from, to) {
var currentShortest = null;
	forEach(possibleRoutes(from, to), function(route) {
		if (!currentShortest || currentShortest.length > route.length)
			currentShortest = route;
		});
	return currentShortest;
}

shortestRoute("Point Teohotepapapa", "Point Kiukiu");

function printAll(from, to){
	forEach(possibleRoutes(from,to), function(route){
		alert(route);
	});
}

printAll("Point Teohotepapapa", "Point Kiukiu");

//map

function point(x, y) {
return {x: x, y: y};
}
function addPoints(a, b) {
return point(a.x + b.x, a.y + b.y);
}
function samePoint(a, b) {
return a.x == b.x && a.y == b.y;
}
samePoint(addPoints(point(10, 10), point(4, -2)),
point(14, 8));
/*
function possibleDirections(from){
	pointAbove.b = from.b -1;
	pointAbove.a = from.a;
}*/

function possibleDirections(from) {
var mapSize = 20;
	function insideMap(point) {
		return point.x >= 0 && point.x < mapSize &&
			point.y >= 0 && point.y < mapSize;
	}
	var directions = [point(-1, 0), point(1, 0), point(0, -1),
					point(0, 1), point(-1, -1), point(-1, 1),
					point(1, 1), point(1, -1)];
		return filter(insideMap, map(partial(addPoints, from),
			directions));
}
	show(possibleDirections(point(0, 0)));


	function asArray(quasiArray, start) {
	var result = [];
		for (var i = (start || 0); i < quasiArray.length; i++)
			result.push(quasiArray[i]);
			return result;
	}
	function partial(func) {
		var fixedArgs = asArray(arguments, 1);
			return function(){
				return func.apply(null, fixedArgs.concat(asArray(arguments)));
		};
	}

	function estimatedDistance(pointA, pointB) {
		var dx = Math.abs(pointA.x - pointB.x),
	
		dy = Math.abs(pointA.y - pointB.y);
		if (dx > dy)
			return (dx - dy) * 100 + dy * 141;
		else
			return (dy - dx) * 100 + dx * 141;
}


