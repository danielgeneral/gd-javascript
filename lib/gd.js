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
    var STATE = 1;

    /**
     * The attribute map maps the id of a type to the attributes
     * you can get from the server
     */
    var attr_map = {
        0:[
            'largest_city', 'state_name', 'wiki_url', 'iso', 
            'capital', 'name'
        ],
        1:[
            'name', 'wiki_url', 'area', 'capital',
            'population'       
        ]
    }

    /**
     * The url map maps 
     */
    var url_map = {
        'get':{
            0:'/api/geo/country',
            1:'/api/geo/country/:name/state'
        },
        'borders':{
            0:'/api/geo/country/borders',
            1:'/api/geo/state/borders'
        }
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
     * A helper function that builds the url for a type of 
     * @param {*} map_type The map type
     * @param {*} type The data type
     * @param {*} attr The data attribute
     * @param {*} url_transform The url transformation
     * @returns {String} 
     */
    function _buildURL(map_type, type, attr, url_transform){
        if(!type in attr_map){
            throw new Error("Unkown type", type);
        }

        if(map_type === 'get'){
            var attrs = attr_map[type];        
            if(attrs.indexOf(attr) === -1){
                throw new Error("Unknow attr", attr);
            }
        }

        var url = url_map[map_type][type];
        if(url_transform){
            for(var key in url_transform){
                if(key !== 'name'){
                    throw new Error("Unknown url transform", key);
                }
                var okey = ":" + key;
                url = url.replace(okey, url_transform[key]);
            }
        }

        return url;
    }

    /**
     * A function that returns information from general data
     * @param {*} type The class type
     * @param {*} attr The attribute to return
     * @param {*} url_transform The transform object
     */
    async function get(type, attr, url_transform){
        try{
            var url = _buildURL('get', type, attr, url_transform)
            var data = await query(url, {'attr': attr});
            if(!data.hasOwnProperty('data')){
                return null;
            }
            return data['data'];
        }catch(err){
            throw err;
        }        
    }

    /**
     * A function that checks if two entities are neighbors 
     * @param {*} type The type of object
     * @param {*} first_name A name of a geographic entity
     * @param {*} second_name A name of a geographic entity
     * @returns {boolean} 
     */
    async function borders(type, first_name, second_name){
        try{
            var url = _buildURL('borders', type)
            var data = await query(url, {'first_name': first_name, 'second_name':second_name});
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
            'country':COUNTRY,
            'state':STATE
        },

        // Functions
        get:get,
        borders:borders
    }
});

if(typeof window === "undefined"){
    if(module.exports){
        module.exports.GeneralData = GeneralData;
    }
}