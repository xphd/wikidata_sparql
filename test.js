const WikidataSearch = require('wikidata-search').WikidataSearch;
const wikidataSearch = new WikidataSearch();

let ids = ["Q47703"]

wikidataSearch.getEntities(ids, true, function (response, err) {
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
    let entities = response.entities;
    // entities.forEach(entity=>{
    //     console.log("entity label",entity["label"])
    // })
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let entity = entities[i];
        // map_id_to_entity.set(id, entity)
        // console.log(id,entity["label"])
        console.log(entity)
    }
    
})