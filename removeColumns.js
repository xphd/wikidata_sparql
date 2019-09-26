const csv = require('csvtojson')
const ObjectsToCsv = require('objects-to-csv');
const csvFilePath = './augment_union.csv'


let map_key_count = new Map();

csv().fromFile(csvFilePath)
    .then(objs => {    
        objs.forEach(obj=>{
            let keys = Object.keys(obj)
            keys.forEach(key=>{
                if (obj[key]){
                    if (map_key_count.has(key)) {
                        let count = map_key_count.get(key)
                        map_key_count.set(key, 1 + count)
                    } else {
                        map_key_count.set(key, 1)
                    }
                }
                
            })                  
        })

        let all_keys= Array.from(map_key_count.keys())
        let remove_keys = []
        all_keys.forEach(key=>{
            // console.log(">===")
            // console.log(key)
            // console.log(map_key_count.get(key))
            // console.log("===<")
            if (map_key_count.get(key)<objs.length){
                remove_keys.push(key)
            }
        })
        console.log(remove_keys)

        objs.forEach(obj=>{
            remove_keys.forEach(key=>{
                delete obj[key]
            })
        })

        // objs.forEach(obj => {
        //     let col_name = obj[col_selected]
        //     let tmpObj = map_name_to_object.get(col_name)
        //     let id = tmpObj["id"]
        //     let entity = map_id_to_entity.get(id)
        //     let claims = entity.claims
        //     obj["id"] = id;
        //     obj["label"] = entity["label"]
        //     claims.forEach(claim => {
        //         let property = claim['property']
        //         let value = claim['value']
        //         obj[property] = value
        //     })
        // })
        const csv = new ObjectsToCsv(objs);
        // Save to file:
        csv.toDisk('./augment_union_intersection.csv');
    })