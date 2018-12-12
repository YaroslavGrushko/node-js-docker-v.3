// var mongoose = require('../libs/mongoose');
var async = require('async');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var config = require('../config');
var log = require('../libs/log')(module);

// getPlaces() async
async function getPlaces() {
    var data = await getPLACES();
    return data;
}
// getPLACES:
// show all users
// get as parametr incoming callback and execute it after completed
function getPLACES() {
    return new Promise(resolve => {

        // Connection URL
        const url = config.get('my-mongo:mongo-url');
        // Database Name
        const dbName = config.get('my-mongo:dbName');

        // Use connect method to connect to the server
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            log.info("Connected successfully to server from getPlaces.js");

            const db = client.db(dbName);
            findDocuments(db, function(data) {
                log.info("PLACES was fetched succesfully");
                // console.log(data);
                var processedData = data[0];
                var index = [];

                // build the index
                for (var x in processedData) {
                    index.push(x);
                }

                // build newData without id (without first row in processedData)
                var newDATA = {};
                for (var i = 1; i < index.length; i++) {
                    newDATA[index[i]] = processedData[index[i]]
                }
                console.log(newDATA);
                resolve(newDATA);
                client.close();
            });
        });
    });
}
// get document from mongo
const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}
module.exports = getPlaces;