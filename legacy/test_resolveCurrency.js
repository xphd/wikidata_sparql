
var WikidataSearch = require('wikidata-search').WikidataSearch;

let raw_value = "+25000000http://www.wikidata.org/entity/Q4917"

let [v,d] = resolveCurrency(raw_value)

console.log(v)
console.log(d)

function resolveCurrency(raw_value){
    let index = raw_value.indexOf("h")
    // console.log(index)
    let value_string = raw_value.slice(0,index);
    let value = Number(value_string)
    let denomination = raw_value.slice(index)
    name_of_denomination = getNameOfDenomination(denomination)
    return [value,name_of_denomination]
}

function getNameOfDenomination(denomination){
    let index = denomination.indexOf("Q");
    // console.log(index)
    let id = denomination.slice(index)
    console.log(id)
    var wikidataSearch = new WikidataSearch();
    wikidataSearch.getEntities([id], true, function(result,err){
        if (err) {
            console.log('Uh oh, we got an error! : ' + err);
            return;
        }
        let entities = result.entities;
        let entity = entities[0]
        console.log(entity["label"])
        
    })
    return entity["label"]
}