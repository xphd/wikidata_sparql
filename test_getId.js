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

        wikidataSearch.getEntities(ids, true, function (response, error) {
            if (error) {
                console.log("getEntities error:", error)
                return;
            }
            let entities = response.entities;
            for (let i = 0; i < ids.length; i++) {
                // let id = ids[i];
                let entity = entities[i];
                let claims = entity["claims"]
                claims.forEach(claim=>{
                    let property = claim["property"]
                    let value = claim["value"]
                    if (property=="instance of" && value=="")
                })
                // console.log(entity)
            }
        })
    })

})