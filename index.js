/*
 * Module Dependencies
 */

var async = require('async');
var fmt = require('util').format;
var log = require('debug')('crown');
var request = require('request');
var cheerio = require('cheerio');

// helper
var allPossibleCases = require('./cases');

// I could probably do this part a bit better but ¯\_(ツ)_/¯
var arr = ['A', 'B', 'C', 'D', 'E', 'F']
var allArrays = [arr, arr, arr, arr, arr, arr];

var listOfCombinations = allPossibleCases(allArrays);
var SOURCE = 'http://s3-eu-west-1.amazonaws.com/puzzleinabucket/%s.html';

// I need async for the callback from request 
async.eachLimit(listOfCombinations, 2, function(code, next) {
  var url = fmt(SOURCE, code);

  request.get(url, function(err, response, body) {
    if (err) return cb(err);
    var $ = cheerio.load(body);

    var text  = $('.gx-rteElement-P').text().trim();
    var failMessage = 'Sorry - you did not get all the questions correct. Please try again.';
    if (text.length == 0 && text !== failMessage) {
      log('found', url);
      return null;
    } 
    next();
  }); 
});