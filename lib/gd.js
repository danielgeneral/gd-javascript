var fetch;
if(typeof window !== "undefined"){
    fetch = window.fetch;
}else{
    fetch = require('node-fetch');
}

/**
 * An object that provides wrapper functionality for the 
 * General Data API.
 * @param {*} api_key The API key from https://www.generaldata.io 
 * @param {*} base_url The base url
 */
var GeneralData = (function(api_key, base_url){

    if(!base_url){
        base_url = 'https://api.generaldata.io'
    }

    /**
     * A list of enums
     */
    var COUNTRY = 0;

    /**
     * The attribute map maps the id of a type to the attributes
     * you can get from the server
     */
    var attr_map = {
        0:[
            'largest_city', 'state_name', 'wiki_url', 'iso', 
            'capital', 'name'
        ]
    }

    /**
     * The url map maps 
     */
    var url_map = {
        0:'/api/geo/country'
    }

    /**
     * An internal function that queries the  backend
     * @param {*} url The url object
     * @param {*} body The body
     */
    async function query(url, body){
        try{
            var effective_url = base_url + url;
            effective_url += '?api_key=' + api_key;
            for(var key in body){
                effective_url += `&${key}=${body[key]}`
            }

            var res = await fetch(effective_url);
            var json = await res.json();
            return json;
        }catch(err){
            throw err;
        }
    }

    /**
     * A function that returns information from general data
     * @param {*} type The class type
     * @param {*} attr The attribute to return
     */
    async function get(type, attr){
        try{
            if(type !== COUNTRY){
                throw new Error("Unkown type", type);
            }

            console.log(attr_map, attr);
            var attrs = attr_map[type];
        
            if(attrs.indexOf(attr) === -1){
                throw new Error("Unknow attr", attr);
            }

            var url = url_map[type];
            var data = await query(url, {'attr': attr});
            if(!data.hasOwnProperty('data')){
                return null;
            }
            return data['data'];
        }catch(err){
            throw err;
        }        
    }


    return {
        types:{
            'country':COUNTRY
        },
        get:get
    }
});

if(typeof window === "undefined"){
    if(module.exports){
        module.exports.GeneralData = GeneralData;
    }
}