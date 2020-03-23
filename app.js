'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var assert = require('assert');
var mongoose = require('mongoose');
var ejs = require('ejs');
var promises = require('promises');
require('./models');


var dotenv = require('dotenv');
dotenv.config();



const dbname = 'coronadb';
const collname = 'Deaths';
//var coro = mongoose.model('Deaths')

var url = 'mongodb://' + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + '@145.14.157.129/coronadb';
console.log(url)
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
var mongoDB = 'mongodb://' + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD +'@145.14.157.129/coronadb';

//
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//app.get('/', function (req, res, next) {
//    res.render("index")
//})
app.get('/', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db, callback) {
        if (err) throw err;
        var dbo = db.db("coronadb");
        dbo.collection("corona").find({}).toArray(function (err, result) {
            if (err) throw err;

            var summary_recovered   = gettimeserieslabel(result, 'description', 'recovered_summary', 0);
            var summary_change_rec  = gettimeserieslabel(result, 'description', 'recovered_summary', 'change');
            var summary_deaths      = gettimeserieslabel(result, 'description', 'deaths_summary', 0);
            var summary_change_de   = gettimeserieslabel(result, 'description', 'deaths_summary', 'change');
            var summary_confirmed   = gettimeserieslabel(result, 'description', 'confirmed_summary', 0);
            var summary_change_con  = gettimeserieslabel(result, 'description', 'confirmed_summary', 'change');
            var summary_confirmed   = gettimeserieslabel(result, 'description', 'confirmed_summary', 0);
            var summary_change_con  = gettimeserieslabel(result, 'description', 'confirmed_summary', 'change');
            var summary_change_con  = gettimeserieslabel(result, 'description', 'confirmed_summary', 'change');
            var locdata             =   getnestarr(result, 'description', 'location_summary');
            var timeseriesdata      = getnestarr(result, 'description', 'confirmed_timeseries');

            //console.log(timeseriesdata)
            console.log(JSON.stringify(timeseriesdata));
            

            res.render('index', {
                title: 'Line chart',
           
                summary_recovered  :summary_recovered ,
                summary_change_rec :summary_change_rec,
                summary_deaths     :summary_deaths    ,
                summary_change_de  :summary_change_de ,
                summary_confirmed  :summary_confirmed ,
                summary_change_con :summary_change_con,
                locdata            :JSON.stringify(locdata),
                timeseriesdata     :JSON.stringify(timeseriesdata )   
            })

            db.close();
        });
    })
})
app.get('/cookiepolicy', function (req, res, next) {
    res.render('cookiepolicy')
})


function gettimeserieslabel(postData, kval, ckval,pval) {
    var arr = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i][kval] == ckval) {
            arr.push(postData[i][pval]);
        }
    }
    return arr;
}

function getnestarr(postData, kval, ckval) {
    var arr = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i][kval] == ckval) {
            arr.push(postData[i]);
        }
    }
    return arr;
}


function gettimeseries(postData) {
    var datai = [];
    var i = 0;
    postData.forEach(function (content, callback) {
        //console.log(content)
        datai=content["0"]
        }

    );
    return datai;
    
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(err)
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err)
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err)
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});



