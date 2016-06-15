var async = require('async'),
  debug = require('debug')('register'),
  MongoClient = require('mongodb').MongoClient;
  
function init(dburl, dbname) {
  return {
    register: function (person, cb) {
      async.waterfall([
        function(next){
          MongoClient.connect(dburl,next);
        },
        function(db,next){
          db.collection(dbname, next);
        },
        function(collection, next){
          collection.find({email: person.email}).toArray(function(error, item){
            next(error || (item.length>=1),collection);
          });
        },
        function(collection, next) {
          collection.insert(person, {safe: true}, next);
        }
      ], cb);       
    },
     
    getApplicants: function (query, sort, cb) {
      async.waterfall([
        function (next) {
          MongoClient.connect(dburl, next);
        },
        function (db, next) {
          db.collection(dbname, next);
        },
        function (collection, next) {
          collection.find(query).sort(sort).toArray(next);
        }
      ], cb);
    },
    
    updateRow: function (query, update, cb) {
      async.waterfall([
        function (next) {
          MongoClient.connect(dburl, next);
        },
        function (db, next) {
          db.collection(dbname, next);
        },
        function (collection, next) {
          collection.update(query, update, next);
        }
      ], cb);
    }
  }
}
 
module.exports = init;
