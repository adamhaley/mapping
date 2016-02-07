#!/usr/bin/env node
var exec = require('child-process-promise').exec;
var fs = require('fs');

var fill = "-fill"
	, step = "01"
	, zoom = "2"
	;


var config = {
	rootDir: "/Users/adamhaley/www/mapping/",
	srcFilename: "es-hftr-map-z"+zoom+"-step-"+step+fill+"-fs8.png",
	srcDir: "MapZooms_v3/hftr-map-z"+zoom+"-v3-comp/",
	outputDir: "map_tiles/z"+zoom+"-step-"+step+fill,
	vrtDir: "vrt/"
}

var gcp = {
	"zoom2": "-gcp 7202 0 -75.11309750080589 40.00075722790161 -gcp 0 9379 -75.20276002405969 39.909756458032085 -gcp 7202 9379 -75.11309750080589 39.909756458032085",
	"zoom3": "-gcp 16723 0 -75.11309750080589 40.00075722790161 -gcp 0 21782 -75.20276002405969 39.909756458032085 -gcp 16723 21782 -75.11309750080589 39.909756458032085"
}

var zooms = {
	"zoom2": "14-16",
	"zoom3": "16-18"
}

// remove any stale vrt files from previous executions of this script
fs.unlink("vrt/translated.vrt",function(data){
	console.log(data);
});
fs.unlink("vrt/warped.vrt",function(data){
	console.log(data);
});
fs.unlink("vrt/expanded.vrt",function(data){
	console.log(data);
});


var command1 = "gdal_translate -of VRT -a_srs EPSG:4326  " + gcp["zoom" + zoom] + " " + config.srcDir + config.srcFilename + " " + config.vrtDir + "translated.vrt";
var command2 = "gdalwarp -of VRT -t_srs EPSG:4326 "+config.vrtDir+"translated.vrt "+config.vrtDir+"warped.vrt";
var command3 = "gdal_translate -of vrt -expand rgba "+config.vrtDir+"warped.vrt "+config.vrtDir+"expanded.vrt";
var command4 = "gdal2tiles.py --zoom " + zooms["zoom" + zoom] + " "+config.vrtDir+"expanded.vrt " + config.outputDir;

var progressHandler = function(childProcess){
	console.log('[spawn] childProcess.pid: ', childProcess.pid);
	childProcess.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	childProcess.stderr.on('data', function (data) {
		console.log('[spawn] stderr: ', data.toString());
	});
}

var execCommand4 = function(){
	console.log("running " + command4);
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
	console.log("running " + command3);
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
	console.log("running " + command2);
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
console.log("running " + command1);
exec(command1,[])
.progress(progressHandler)
.then(function(){
	console.log("[spawn] done!");
	execCommand2();
})
.fail(function(err){
	console.error("[spawn] ERROR: ", err);
});

