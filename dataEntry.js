var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  next();
});

app.listen(4004);
console.log('Listening at 4004');

DATABASE_HOST = 'localhost';
DATABASE_NODE = 'scholarship';
DATABASE_USERNAME = 'root';
DATABASE_PASSWORD = 'cheese';

var connectionNode = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NODE
});

app.post('/saveData', function(request, response) {
    var dataType=request.body.type;
    if(dataType == 'state'){
    	console.log('i shoudlnt be here')
    	var statesData =request.body.data;
    	for(var i=0;i<statesData.length;i++){    		
    		(function(i) {
    			 connectionNode.query('INSERT INTO State (state_id, state_name) VALUES(?,?);',[statesData[i].id, statesData[i].name],function(err, rows){
			        if(err) {
			            console.log(err);
			        }    
				});
			})(i);
    	}
    	console.log(statesData.length+' states have been updated');
		response.json('success');
    }else if(dataType == 'district'){
    	console.log('i am here')
    	var districtsData =request.body.data;
    	console.log(districtsData.length)
    	for(var i=0;i<districtsData.length;i++){    		
    		(function(i) {
    			 connectionNode.query('INSERT INTO District (district_id, state_id, district_name) VALUES(?,?,?);',[districtsData[i].districtId, districtsData[i].stateId,districtsData[i].districtName],function(err, rows){
			        if(err) {
			            throw err;
			        }    
				});
			})(i);			
    	}
    	console.log(districtsData.length+' states have been updated');
		response.json('success');
    }else if(dataType == 'mandal'){
    	
    }
    connectionNode.end();
    // console.log(statesData.length+' states have been updated');
	response.json('success');
});



