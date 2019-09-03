const WikidataSearch = require('wikidata-search').WikidataSearch;
const wikidataSearch = new WikidataSearch();

// const getEntities = require("./getEntities.js")

let col_names = ["The Shawshank Redemption", "The Dark Knight", "The Godfather", "The Godfather: Part II"]

col_names.forEach(name => {
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

        let found_entities = []
        wikidataSearch.getEntities(ids, true, function (response, error) {
            if (error) {
                console.log("getEntities error:", error)
                return;
            }
            let entities = response.entities;
            let isEntityFound = false
            for (let i = 0; i < entities.length; i++) {
                // let id = ids[i];
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
                // console.log(entity)
            }
        })
    })

})