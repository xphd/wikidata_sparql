const csv = require('csvtojson')
const csvFilePath = './imdb_10.csv'

var WikidataSearch = require('wikidata-search').WikidataSearch;
var wikidataSearch = new WikidataSearch();

const ObjectsToCsv = require('objects-to-csv');

let col_selected = "title"

let map = new Map();
let mapId = new Map();
let col_names = [];

csv().fromFile(csvFilePath)
    .then(objs => {
        objs.forEach(obj => {
            let col_name = obj[col_selected]
            col_names.push(col_name)
            // map.set(col_name,null)
        })
        getIds(col_names, map, mapId)
    })



function getIds(col_names, map, mapId) {
    let ids = []
    col_names.forEach(name => {
        wikidataSearch.set('search', name)
        wikidataSearch.search(function (result, error) {
            //check the 'error' parameter for any errors, and your results are in 'result'.
            if (error) {
                console.log(error)
            } else {
                // console.log(result.results)
                results = result.results
                // console.log(results.length)
                // some function
                //console.log(results[0].id)
                let id = results[0].id
                ids.push(id)
                let label = results[0].label
                // console.log(id)
                // console.log("col_name:",name)
                // console.log("result label:", label)
                let obj = {
                    col_name: name,
                    label: label, id: id,
                }
                map.set(name, obj)

                console.log(map.get(name))
            }
            // console.log(map.size)
            if (map.size == col_names.length) {
                getEntities(ids, map, mapId)
            }
        })
    })

}

function getEntities(ids, map, mapId) {
    wikidataSearch.getEntities(ids, true, function (result, err) {
        //Check for errors.
        if (err) {
            console.log('Uh oh, we got an error! : ' + err);
            return;
        }

        //Now let's look at the cool info we go back. Pretty cool, and pretty quick!
        // console.log(util.inspect(result, true, null));
        // console.log(result.entities[0].claims.length)
        // let claims = result.entities[0].claims
        // claims.forEach(claim=>{
        //     // console.log("cost"== claim.property)
        // if (claim.property=="cost"){
        //     console.log(claim.value)
        // }

        // })
        let entities = result.entities;
        // entities.forEach(entity=>{
        //     console.log("entity label",entity["label"])
        // })
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let entity = entities[i];
            mapId.set(id, entity)
            // console.log(id,entity["label"])
        }
        csv().fromFile(csvFilePath)
            .then(objs => {
                objs.forEach(obj => {
                    let col_name = obj[col_selected]
                    let tmpObj = map.get(col_name)
                    let id = tmpObj["id"]
                    let entity = mapId.get(id)
                    let claims = entity.claims
                    obj["id"]=id;
                    obj["label"]= entity["label"]
                    claims.forEach(claim => {
                        // console.log("cost"== claim.property)
                        if (claim.property == "cost") {
                            console.log(claim.value)
                            obj["cost"]=    claim.value 
                            console.log(obj)                  
                        }
                    })
                })
                
                    const csv = new ObjectsToCsv(objs);
                   
                    // Save to file:
                    csv.toDisk('./augment.csv');
                   
                    // Return the CSV file as string:
                    // console.log(await csv.toString());
                  
        })
    })
}