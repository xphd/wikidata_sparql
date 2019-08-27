// const { queryTaxonomy } = require('wikidata-taxonomy')
 
// var options = { lang: 'en', brief: true }
// queryTaxonomy('Q47703', options)
// .then(taxonomy => {
//   taxonomy.concepts.forEach(concept => {
//     var qid = concept.notation[0]
//     var label = (concept.prefLabel || {}).fr || '???'
//     console.log('%s %s', qid, label)
//   })
// })
// .catch(error => console.error("E",error))

// let itemName = "god father"

// let requestUrl =  "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Google&language=en"

// const request = require('request');

// request(requestUrl, function (error, response, body) {
//   console.error('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

var util = require('util');

//First, create a new Wikidata Search object.
var WikidataSearch = require('wikidata-search').WikidataSearch;
var wikidataSearch = new WikidataSearch();

//To search:
let results = [];
wikidataSearch.set('search', "The Godfather"); //set the search term
wikidataSearch.search(function(result, error) {

    //check the 'error' parameter for any errors, and your results are in 'result'.
    if (error){
        console.log(error)
    }else{
        // console.log(result.results)
        results=result.results
        // console.log(results.length)
        // some function
        //console.log(results[0].id)
        let id = results[0].id
        console.log(id)
        wikidataSearch.getEntities([id],true,function(result, err) {
            //Check for errors.
            if (err) {
                console.log('Uh oh, we got an error! : ' + err);
                return;
            }
    
            //Now let's look at the cool info we go back. Pretty cool, and pretty quick!
            // console.log(util.inspect(result, true, null));
            // console.log(result.entities[0].claims.length)
            let claims = result.entities[0].claims
            claims.forEach(claim=>{
                // console.log("cost"== claim.property)
            if (claim.property=="cost"){
                console.log(claim.value)
            }

            })
        })
    }
    
})



//To get detailed info on one or more entities:
// wikidataSearch.getEntities(['id', 'id', ...], true, function(result, error) {
//     //check the 'error' parameter for any errors, and your results are in 'result'.
// });