var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var Request = require('request');

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
    
});



