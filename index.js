function addPlacesForGraph(graph) {
  return function(places) {
    for (const place of places) {
        graph.addNode(place.id);
    }
    return places;
  }
}

function addExitsForGraph(graph) {
  return function(exits) {
    for (const exit of exits) {
      graph.addLink(exit.place_id, exit.destination_id);
    }
    return exits;
  }
}


var handleNetErr = function(e) { console.log("Failed to load data!", e ); return e; };

// let's create a simple graph:
var graph = require('ngraph.graph')();
var renderGraph = require('ngraph.pixel');

var addPlaces = fetch("places.json").catch(handleNetErr)
    .then(blob => blob.json())
    .then(addPlacesForGraph(graph))
    .catch(handleNetErr);

var addExits = fetch("exits.json").catch(handleNetErr)
    .then(blob => blob.json())
    .then(addExitsForGraph(graph))
    .catch(handleNetErr);

addPlaces.then(places => console.log("Added " + places.length + " places"));
addExits.then(exits => console.log("Added " + exits.length + " exits"));

Promise.all([addPlaces, addExits]).then(results => { renderGraph(graph); });
