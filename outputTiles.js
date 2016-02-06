#!/usr/bin/env node
var fill = ""
	, step = "01"
	, zoom = "2"
	;

var config = {
	srcFilename: "es-hftr-map-z2-step-" + step + "-fs8.png",
	srcDir: "MapZooms_v3/hftr-map-z" + zoom + "-v3-comp/",
 	outputDir: "map_tiles/z" + zoom + "-step-" + step + fill
}

console.log(config);

