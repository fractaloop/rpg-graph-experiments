// let's create a simple graph:
var nggraph = require('ngraph.graph');
var ngpixel = require('ngraph.pixel');

var idForPlace = function(place) {
  return place.name + " (" + place.id + ")";
}

// Function generators for chained Promises
var addPlacesToGraph = function(graph) {
  return function(places) {
    for (const place of places) {
      graph.addNode(idForPlace(place));
    }
    console.log("Added " + places.length + " places")
    return places;
  }
}

var addExitsToGraph = function(places, graph) {
  return function(exits) {
    for (const exit of exits) {
      var src = places[exit.place_id];
      var dest = places[exit.destination_id];
      // Lots of missing (hidden) places... Too noisy
      if (!src && !dest) {
        // console.log("Error: No places found for link between: " + exit.place_id + " " + exit.direction + " of  " + exit.destination_id);
      } else if (!src) {
        // console.log("Error: No place found for source of link: " + exit.place_id + " " + exit.direction + " of " + JSON.stringify(dest));
      } else if (!dest) {
        // console.log("Error: No place found for destination of link: " + JSON.stringify(src) + " " + exit.direction + " of " + exit.destination_id);
      } else {
        graph.addLink(idForPlace(src), idForPlace(dest));
      }
    }
    console.log("Added " + exits.length + " exits")
    return exits;
  }
}

var handleException = function(e) {
  console.log("Failed to load data!", e);
  return e;
};

// Main rendering
var rendererForGraph = function(graph) {
  return function(results) {
    // TODO: Graph stats about results?
    var renderer = ngpixel(graph, {
      link: renderLink,
      node: renderNode
    });
    renderer.on('nodehover', function(node) {
      if (node) {
        console.log(JSON.stringify(node));
      }
    });
    return renderer;
  }
}

// Rendering style
function renderNode(node) {
  return {
    color: Math.random() * 0xFFFFFF | 0,
    size: Math.random() * 21 + 10,
  };
}

function renderLink(link) {
  return {
    fromColor: 0xFF0000,
    toColor: 0x00FF00
  };
}

function createNodeUI(node) {
  return {
    color: 0xFF00FF,
    size: 20
  };
}

// Entry point
(function() {
  var g = nggraph()
  console.log("Loading places and exits...")

  var places = fetch("places.json").catch(handleException)
    .then(blob => blob.json())
    .then(addPlacesToGraph(g))
    .then(places => fetch("exits.json")
      .then(blob => blob.json())
      .then(addExitsToGraph(places, g)))
    .then(rendererForGraph(g))
    .catch(handleException);
})();
