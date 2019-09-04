const fs = require("fs")
const csvjson = require("csvjson")

const ObjectsToCsv = require('objects-to-csv');

const csv = require('csvtojson')
const csvFilePath = 'imdb_10.csv'

const WikidataSearch = require('wikidata-search').WikidataSearch;
const wikidataSearch = new WikidataSearch();

let col_selected = 'title'

// const getEntities = require("./getEntities.js")
let map_name_to_object = new Map(); // map name shown in colum to object returned by "wikidata serach"
let map_id_to_entity = new Map(); // map id (begin with "Q") to entity (item wikidata)

// get names for search from the csv file
let col_names = [];

let data = fs.readFileSync(csvFilePath, { encoding: 'utf8' })
let options = {
    delimiter: ',', // optional
    quote: '"' // optional
};
let objs = csvjson.toObject(data, options);
// console.log(objs.length)
objs.forEach(obj => {
    let col_name = obj[col_selected]
    col_names.push(col_name)
})

// csv().fromFile(csvFilePath)
//     .then(objs => {
//         objs.forEach(obj => {
//             let col_name = obj[col_selected]
//             col_names.push(col_name)
//         })

//     })
// let col_names = ["The Shawshank Redemption", "The Dark Knight", "The Godfather", "The Godfather: Part II"]

// console.log(col_names.length)
let found_entities = []

col_names.forEach(name => {
    // console.log(name)
    wikidataSearch.set('search', name)
    wikidataSearch.search(function (response, error) {
        if (error) {
            console.log("search error:", error)
            return
        }
        let results = response.results

        // extract ids from results
        let ids = []
        results.forEach(function (result) {
            let id = result["id"]
            ids.push(id);
        })

        wikidataSearch.getEntities(ids, true, function (response, error) {
            if (error) {
                console.log("getEntities error:", error)
                return;
            }
            let entities = response.entities;
            let isEntityFound = false
            for (let i = 0; i < entities.length; i++) {
                let id = ids[i];
                let entity = entities[i];
                let claims = entity["claims"]
                for (let j = 0; j < claims.length; j++) {
                    let claim = claims[j]
                    let property = claim["property"]
                    let value = claim["value"]

                    if (property == "instance of") {
                        if (value == "film") {
                            // entity
                            console.log("film entity is:", entity)
                            let obj = {
                                id: id,
                                label: entity["label"]
                            }
                            map_name_to_object.set(name, obj)
                            map_id_to_entity.set(id, entity)
                            found_entities.push(entity)
                            isEntityFound = true;
                            if (isEntityFound) {
                                break;
                            }
                        }
                    }
                }
                if (isEntityFound) {
                    break;
                }
            }
            console.log("length of found entities", found_entities.length)
            if (found_entities.length == col_names.length) {
                csv().fromFile(csvFilePath)
                .then(objs => {
                    objs.forEach(obj => {
                        let col_name = obj[col_selected]
                        let tmpObj = map_name_to_object.get(col_name)
                        let id = tmpObj["id"]
                        let entity = map_id_to_entity.get(id)
                        let claims = entity.claims
                        obj["id"] = id;
                        obj["label"] = entity["label"]
                        claims.forEach(claim => {
                            let property = claim['property']
                            let value = claim['value']
                            obj[property] = value
                        })
                    })
                    const csv = new ObjectsToCsv(objs);
                    // Save to file:
                    csv.toDisk('./augment_union.csv');
                })
            }
        })
    })
})