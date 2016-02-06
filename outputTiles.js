#!/usr/bin/env node
var exec = require('child-process-promise').exec;


var fill = "-fill"
	, step = "02"
	, zoom = "2"
	;

var dimensions = {
	"zoom2": {
		"latlng": [40.00075722790161,-75.11309750080589,39.909756458032085],
		"pixels": [0,813,1060]
	},
	"zoom3": {
		"latlng": [],
		"pixels": []
	}
}


var config = {
	rootDir: "/Users/adamhaley/www/mapping/",
	srcFilename: "es-hftr-map-z2-step-" + step + "-fs8.png",
	srcDir: "MapZooms_v3/hftr-map-z" + zoom + "-v3-comp/",
	outputDir: "map_tiles/z" + zoom + "-step-" + step + fill,
	vrtDir: "vrt/"
}

var gcp = {
	"zoom2": "-gcp 813 0 -75.11309750080589 40.00075722790161 -gcp 0 1060 -75.20276002405969 39.909756458032085 -gcp 813 1060 -75.11309750080589 39.909756458032085",
	"zoom3": ""
}

var zooms = {
	"zoom2": "14-16",
	"zoom3": "16-18"
}


var command1 = "gdal_translate -of VRT -a_srs EPSG:4326  " + gcp["zoom" + zoom] + " " + config.srcDir + config.srcFilename + " " + config.vrtDir + "translated.vrt";
var command2 = "gdalwarp -of VRT -t_srs EPSG:4326 "+config.vrtDir+"translated.vrt "+config.vrtDir+"warped.vrt";
var command3 = "gdal_translate -of vrt -expand rgba "+config.vrtDir+"warped.vrt "+config.vrtDir+"expanded.vrt";
var command4 = "gdal2tiles.py --zoom " + zooms["zoom" + zoom] + " "+config.vrtDir+" expanded.vrt " + config.outputDir;

var progressHandler = function(childProcess){
	console.log('[spawn] childProcess.pid: ', childProcess.pid);
	childProcess.stdout.on('data', function (data) {
		console.log('[spawn] stdout: ', data.toString());
	});
	childProcess.stderr.on('data', function (data) {
		console.log('[spawn] stderr: ', data.toString());
	});
}

var execCommand4 = function(){
	console.log("running command1...");
	exec(command4,[])
	.progress(progressHandler)
	.then(function(){
		console.log("Done!!");
	})
	.fail(function(err){
		console.error("[spawn] ERROR: ", err);
	});
};

var execCommand3 = function(){
	console.log("running command1...");
	exec(command3,[])
	.progress(progressHandler)
	.then(function(){
		execCommand4();
	})
	.fail(function(err){
		console.error("[spawn] ERROR: ", err);
	});
};

var execCommand2 = function(){
	console.log("running command2...");
	exec(command2,[])
	.progress(progressHandler)
	.then(function(){
		execCommand3();
	})
	.fail(function(err){
		console.error("[spawn] ERROR: ", err);
	});
};

// spawn gdal scripts as child processes
console.log("running command1...");
exec(command1,[])
.progress(progressHandler)
.then(function(){
	console.log("[spawn] done!");
	execCommand2();
})
.fail(function(err){
	console.error("[spawn] ERROR: ", err);
});

