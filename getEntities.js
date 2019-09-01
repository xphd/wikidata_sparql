

function getEntities(ids, map_name_to_object, map_id_to_entity) {
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
            map_id_to_entity.set(id, entity)
            // console.log(id,entity["label"])
        }
        csv().fromFile(csvFilePath)
            .then(objs => {
                objs.forEach(obj => {
                    let col_name = obj[col_selected]
                    let tmpObj = map_name_to_object.get(col_name)
                    let id = tmpObj["id"]
                    let entity = map_id_to_entity.get(id)
                    let claims = entity.claims
                    obj["id"]=id;
                    obj["label"]= entity["label"]
                    claims.forEach(claim => {
                        // console.log("cost"== claim.property)
                        if (claim.property == "cost") {
                            let raw_value = claim.value;
                            // raw_value example: +25000000http://www.wikidata.org/entity/Q4917
                            // [value,denomination]=resolveCurrency(raw_value)
                            
                            obj["cost"]=raw_value;
                            // obj["denomination"]=denomination
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