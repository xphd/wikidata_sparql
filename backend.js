const csv = require('csvtojson')
const csvFilePath = './imdb_10.csv'

const getIds = require("./getIds.js")

let col_selected = "title"

// for filter
/**
 * property: "instance of"
 * value: "film"
 * 
 */

let map_name_to_object = new Map(); // map name shown in colum to object returned by "wikidata serach"
let map_id_to_entity = new Map(); // map id (begin with "Q") to entity (item wikidata)
let col_names = [];

csv().fromFile(csvFilePath)
    .then(objs => {
        objs.forEach(obj => {
            let col_name = obj[col_selected]
            col_names.push(col_name)
            // map.set(col_name,null)
        })
        getIds(col_names, map_name_to_object, map_id_to_entity)
    })