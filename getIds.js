const WikidataSearch = require('wikidata-search').WikidataSearch;
const wikidataSearch = new WikidataSearch();

const getEntities = require("./getEntities.js")


function getIds(col_names, map_name_to_object, map_id_to_entity) {
    let ids = []
    col_names.forEach(name => {
        wikidataSearch.set('search', name)
        wikidataSearch.search( (response, error)=> {
            //check the 'error' parameter for any errors, and your results are in 'result'.
            if (error) {
                console.log(error)
            } else {
                // console.log(result.results)
                let results = response.results
                // console.log(results.length)
                // some function
                //console.log(results[0].id)

                // select the first result. There should be something like a filter to select
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
                map_name_to_object.set(name, obj)

                console.log(map_name_to_object.get(name))
            }
            // console.log(map.size)
            if (map_name_to_object.size == col_names.length) {
                getEntities(ids, map_name_to_object, map_id_to_entity)
            }
        })
    })

}