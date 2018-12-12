const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var config = require('./config');
var log = require('./libs/log')(module);

// call async getPlaces() function:
async function launchCreateDb() {
    // getPLACES().then((data) => {
    //     dataJSON = JSON.stringify(data);
    //     console.log("data from pre createDb: " + dataJSON);
    //     dataComparation(dataJSON);
    // });
    var getPlaces = require("./Db/getPlaces");
    var data = await getPlaces();
    dataJSON = await JSON.stringify(data);
    await log.info("data from pre createDb: " + dataJSON);
    await dataComparation(dataJSON);
}

function dataComparation(dataJSON) {
    if (dataJSON == "{}") {
        // if db is empty
        log.info("db is empty");
        createPLACES();
    } else {
        // if db is already full
        log.info("db is already full");
    }
}
// launch launchCreateDb() function
launchCreateDb();
//webcames array with city name and src to youtube live
const PLACEStoCreate = {
    "Европа": [{
            city: "Saint-Malo-Le Port",
            src: "https://www.youtube.com/embed/fQ8pFCrVGzE",
            zip: "Saint-Malo",
            time_zone: "Europe/Berlin"
        },
        { city: "Baden-Baden", src: "https://www.youtube.com/embed/KiKuzd-ioRw", zip: "Baden-Baden", time_zone: "Europe/Berlin" },
        //{city:"Venice", src:"https://www.youtube.com/embed/YiiNSrDuECw", zip: "Venezia", time_zone:"Europe/Madrid"}
        { city: "Venice", src: "https://www.youtube.com/embed/vPbQcM4k1Ys", zip: "Moscow", time_zone: "Europe/Madrid" },
        { city: "Oslo", src: "https://www.youtube.com/embed/DhPYnvZmFQA", zip: "Oslo", time_zone: "Europe/Madrid" }
    ],
    "Азия": [
        { city: "Koh Samui", src: "https://www.youtube.com/embed/y5hjoAZGf_E", zip: "Ko Samui", time_zone: "Asia/Saigon" },
        { city: "Tokyo", src: "https://www.youtube.com/embed/JYBpu1OyP0c", zip: "Tokyo", time_zone: "Asia/Tokyo" },
        { city: "Tokyo", src: "https://www.youtube.com/embed/nKMuBisZsZI", zip: "Tokyo", time_zone: "Asia/Tokyo" },
        { city: "Earth", src: "https://www.youtube.com/embed/qyEzsAy4qeU", zip: "Kiev", time_zone: "Europe/Kiev" }
    ],
    "Америка": [
        { city: "New York", src: "https://www.youtube.com/embed/la90mA4VLa4", zip: "New York", time_zone: "America/New_York" },
        { city: "Banff", src: "https://www.youtube.com/embed/2UX83tXoZoU", zip: "Banff", time_zone: "Canada/Central" },
        { city: "Tucson", src: "https://www.youtube.com/embed/nmoQp7gyzIk", zip: "Tucson", time_zone: "America/Fort_Nelson" },
        { city: "Mexico City", src: "https://www.youtube.com/embed/jHD8XrAYAyk", zip: "Mexico City", time_zone: "America/Mexico_City" }
    ],
    "Африка": [
        { city: "Cape Town", src: "https://www.youtube.com/embed/Ki-d5f5_WwU", zip: "Cape Town", time_zone: "Africa/Cairo" },
        { city: "Melbourne", src: "https://www.youtube.com/embed/FZ72I6o6Z9k", zip: "Melbourne", time_zone: "Australia/Melbourne" },
        { city: "Animals", src: "https://www.youtube.com/embed/TW19E-C8nJ8", zip: "Cape Town", zip: "Cape Town" },
        { city: "Animals", src: "https://www.youtube.com/embed/Kay9czw22ew", zip: "Cape Town", zip: "Cape Town" }
    ]
};

// create PLACES in MongoDb
function createPLACES() {
    // "mongo-url": "mongodb://localhost:27017",
    // Connection URL
    const url = config.get('my-mongo:mongo-url');
    // Database Name
    const dbName = config.get('my-mongo:dbName');
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        log.info("Connected successfully to server from createDb.js");

        const db = client.db(dbName);
        // Get the documents collection
        insertDocuments(db, function() {
            log.info("insertion is completed");
            client.close();
        });
    });
}
const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents (PLACES)
    collection.insertMany([
        // our PLACES const
        PLACEStoCreate
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        log.info("Inserted PLACES into the collection");
        callback(JSON.stringify(result));
    });
}