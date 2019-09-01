const WikidataSearch = require('wikidata-search').WikidataSearch;
const wikidataSearch = new WikidataSearch();

let ids = ["Q172241"]

wikidataSearch.getEntities(ids, true, function (response, error) {    
    if (error) {
        console.log('Uh oh, we got an error! : ' + err);
        return;
    }
    let entities = response.entities;
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let entity = entities[i];
        // map_id_to_entity.set(id, entity)   
        console.log(entity)     
    }
})