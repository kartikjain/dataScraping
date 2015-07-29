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
    console.log('entered request')
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
    	var districtsData =request.body.data;    	
    	for(var i=0;i<districtsData.length;i++){    		
    		(function(i) {
    			 connectionNode.query('INSERT INTO District (district_id, state_id, district_name) VALUES(?,?,?);',[districtsData[i].districtId, districtsData[i].stateId,districtsData[i].districtName],function(err, rows){
			        if(err) {
			            console.log(err);
			        }
                    if(i==districtsData.length-1){
                        console.log(districtsData.length+' districts have been updated');
                        response.json('success');
                    }
				});                
			})(i);
            
    	}		
    }else if(dataType == 'mandal'){        
    	var mandalsData =request.body.data;      
        for(var i=0;i<mandalsData.length;i++){
            (function(i) {
                 connectionNode.query('INSERT INTO mandal (mandal_id, district_id, mandal_name) VALUES(?,?,?);',[mandalsData[i].mandal_id, mandalsData[i].district_id,mandalsData[i].mandal_name],function(err, rows){                
                    if(err) {
                        console.log(err);
                    }                    
                    if(i==mandalsData.length-1){
                        console.log(mandalsData.length+' mandals have been updated');
                        response.json('success');
                    }
                });
            })(i);
        }
    }else if(dataType == 'studyLevel'){
        var studyLevelData = request.body.data;
        for(var i=0;i<studyLevelData.length;i++){
            (function(i) {
                 connectionNode.query('INSERT INTO Study_level (level_id, level_name) VALUES(?,?);',[studyLevelData[i].id, studyLevelData[i].name],function(err, rows){                
                    if(err) {
                        console.log(err);
                    }                    
                    if(i==studyLevelData.length-1){
                        console.log(studyLevelData.length+' mandals have been updated');
                        response.json('success');
                    }
                });
            })(i);
        }
    }    
});

app.post('/saveInstitutes',function(request,response){

var institutesData = request.body.data;    
 connectionNode.query('INSERT INTO institution (institution_id, mandal_id, institution_name) VALUES(?,?,?);',[institutesData.instututeId, institutesData.mandalId,institutesData.mandalName],function(err, rows){                
    if(err) {
        console.log(err);
    }
    response.json('success')            
});
    
});

app.get('/getDistricts',function(request,response){
    connectionNode.query('Select * from District',[],function(err, rows){
        if(err) {
            console.log(err);
        }
        else{
            response.json(rows)
        }
    });

});

app.get('/getMandals',function(request,response){
    connectionNode.query('SELECT mandal.mandal_id, mandal.district_id, District.state_id FROM scholarship.mandal,scholarship.District where District.district_id = mandal.district_id;',[],function(err, rows){
        if(err) {
            console.log(err);
        }
        else{
            response.json(rows)
        }
    });
});



