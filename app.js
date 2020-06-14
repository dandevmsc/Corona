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
//var coro = mongoose.model('Deaths')
var url = 'mongodb://' + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + '@' + process.env.Mongodbip;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);

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
            var locdata             =   getnestarr(result, 'description', 'location_summary');
            var timeseriesdata = getnestarr(result, 'description', 'confirmed_timeseries');
            var timeseriesdeathdata = getnestarr(result, 'description', 'deaths_timeseries');
            var timeseriesrecovereddata = getnestarr(result, 'description', 'recovered_timeseries');
            var topcountriesconfirmed = getnestarr(result, 'description', 'confirmed_top');

            //console.log(timeseriesdata)
            console.log(JSON.stringify(topcountriesconfirmed));
            

            res.render('index', {
                title: 'Line chart',
           
                summary_recovered: summary_recovered.toLocaleString() ,
                summary_change_rec: summary_change_rec.toLocaleString(),
                summary_deaths: summary_deaths.toLocaleString()    ,
                summary_change_de: summary_change_de.toLocaleString() ,
                summary_confirmed: summary_confirmed.toLocaleString() ,
                summary_change_con: summary_change_con.toLocaleString(),
                locdata            :JSON.stringify(locdata),
                timeseriesdata: JSON.stringify(timeseriesdata),
                topcountriesconfirmed: JSON.stringify(topcountriesconfirmed),
                timeseriesdeathdata: JSON.stringify(timeseriesdeathdata),
                timeseriesrecovereddata: JSON.stringify(timeseriesrecovereddata)
            })

            db.close();
        });
    })
})
app.get('/cookiepolicy', function (req, res, next) {
    res.render('cookiepolicy')
})

app.get('/robot.txt', function (req, res, next) {
    res.render('robot')
})
app.get('/vaccine', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db, callback) {
        if (err) throw err;
        var dbo = db.db("coronadb");
        dbo.collection("vaccine").find({}).toArray(function (err, result) {
            if (err) throw err;
            var vaccinecat = gettimeserieslabeldeep(result, 'description', 'breakdownproduct', 'Treatment vs Vaccine','Vaccine','Product Category');
            var vaccinenum = gettimeserieslabeldeep(result, 'description', 'breakdownproduct', 'Treatment vs Vaccine', 'Vaccine', 'Productcategorynum');
            var Treatmentstagcat = gettimeserieslabeldeep(result, 'description', 'breakdownstage', 'Treatment vs Vaccine', 'Treatment', 'Stage of Development');
            var Treatmentstagnum = gettimeserieslabeldeep(result, 'description', 'breakdownstage', 'Treatment vs Vaccine', 'Treatment', 'Productcategorynum');

            var vaccinestagcat = gettimeserieslabeldeep(result, 'description', 'breakdownstage', 'Treatment vs Vaccine', 'Vaccine', 'Stage of Development');
            var vaccinestagnum = gettimeserieslabeldeep(result, 'description', 'breakdownstage', 'Treatment vs Vaccine', 'Vaccine', 'Productcategorynum');
            var Treatmentcat = gettimeserieslabeldeep(result, 'description', 'breakdownproduct', 'Treatment vs Vaccine', 'Treatment', 'Product Category');
            var Treatmentnum = gettimeserieslabeldeep(result, 'description', 'breakdownproduct', 'Treatment vs Vaccine', 'Treatment', 'Productcategorynum');
            console.log(vaccinecat)
            res.render('vaccine', {
                vaccinecat :       JSON.stringify(vaccinecat),
                vaccinenum :       JSON.stringify(vaccinenum),
                Treatmentcat :     JSON.stringify(Treatmentcat),
                Treatmentnum:       JSON.stringify(Treatmentnum),

                vaccinestagcat: JSON.stringify(vaccinestagcat),
                vaccinestagnum: JSON.stringify(vaccinestagnum),
                Treatmentstagcat: JSON.stringify(Treatmentstagcat),
                Treatmentstagnum: JSON.stringify(Treatmentstagnum)

            })
            db.close();
        })
    })
})
app.get('/mobility', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db, callback) {
        if (err) throw err;
        var dbo = db.db("coronadb");
        dbo.collection("mobility").find({}).toArray(function (err, result) {
            if (err) throw err;
            var mobility = result;
            res.render('mobility', {
                mobility: JSON.stringify(mobility)

            })

        })
    })
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
function gettimeserieslabeldeep(postData, kval, ckval, pval,jval,dval) {
    var arr = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i][kval] == ckval && postData[i][pval] == jval) {
            arr.push(postData[i][dval]);
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


function gettimeseries(postData, kval, ckval) {
    var arr = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i][kval] == ckval) {
            arr.push(postData[i]);
        }
    }
    return arr;
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



