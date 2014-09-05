// server.js

	// set up ========================
	var express  	= require('express');
	var app      	= express(); 								// create our app w/ express
	var morgan	    = require('morgan');
	var port 	 	= Number(process.env.PORT || 8080);
	var bodyParser  = require('body-parser');

	// configuration =================
	app.use(morgan('dev'));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser());

	// application -------------------------------------------------------------
	app.get('/', function(req, res) {

		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	var run_script = function(x,y){
		var util  = require('util'),
		spawn = require('child_process').spawn,
		ls    = spawn('python tiro.py', [x, y]);

		ls.stdout.on('data', function (data) {    // register one or more handlers
			console.log('stdout: ' + data);
		});

		ls.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});

		ls.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});
	}

	app.post('/tiro',function(req,res){
		run_script(req.body.x,req.body.y);
		res.send("hello");
	});


	// listen (start app with node server.js) ======================================
	
	app.listen(port, function() {
		console.log("Listening on " + port);
	});