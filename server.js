// server.js

	// set up ========================
	var express  	= require('express');
	var app      	= express(); 								// create our app w/ express
	var morgan	    = require('morgan');
	var port 	 	= Number(process.env.PORT || 8080);
	var bodyParser  = require('body-parser');
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('database/battleship.db');

	// configuration =================
	app.use(morgan('dev'));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser());

	// application -------------------------------------------------------------
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.post('/newuser',function(req,res){
		db.serialize(function() {
			var stmt = db.prepare("INSERT INTO users(email) VALUES(?)");
			stmt.run(req.body.email); 
			stmt.finalize();

			db.each("SELECT email FROM users", function(err, row) {
				if(err)
					res.send(err);

				console.log("user email: " + row.email);
			});

		});

		res.send("done");
	});

	app.post('/ready',function(req,res){
		db.serialize(function() {
			db.each("SELECT COUNT(*) AS numero FROM users", function(err, row) {
				if(err)
					res.send(err);

				console.log("users count: " + row.numero);
			});

		});

		res.send("done");
	});

	app.post('/reset',function(req,res){
		db.serialize(function() {
			var count = 0;
			db.each("SELECT * FROM users", function(err, row) {
				if(err)
					res.send(err);

				var stmt = db.prepare("INSERT INTO old_users(email) VALUES(?)");
				stmt.run(row.email); 
				stmt.finalize();
				
				if(count == 1){
					db.run("DELETE FROM users");
				}
				else
					count=count+1;
			});
		});

		res.send("done");
	});

	var run_script = function(x,y){
		var util  = require('util'),
		spawn = require('child_process').spawn,
		ls    = spawn('echo', [x, y]);

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