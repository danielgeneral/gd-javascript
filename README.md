# gd-javascript
Javascript client to interact with General Data

## Installation
Install the package with:
    npm install gd-javascript --save

## Usage 
The package needs to be configured for production usage with the API key provided from your General Data account.

```js
let GeneralData = require('gd-javascript').GeneralData;
let gd = new GeneralData('api_key');
let largest_cities = await gd.get(gd.types["country"], "largest_city");
```

### Country
Basic country information can be extracted by using the
get function.

```js
let GeneralData = require('gd-javascript').GeneralData;
let gd = new GeneralData('api_key');
let largest_cities = await gd.get(gd.types["country"], "population");
```

### State
Basic state information can be extracted by using the get function. It should be noted that you will need to 
provide the country name associated with the state.

```js
let GeneralData = require('gd-javascript').GeneralData;
let gd = new GeneralData('api_key');
let largest_cities = await gd.get(gd.types["state"], "area");
```

### Border
You can find if a country (or state) borders another country (or state).

```js
let GeneralData = require('gd-javascript').GeneralData;
let gd = new GeneralData('api_key');

// Check if two countries share a border
let has_country_border = await gd.borders(gd.types["country"], "United States", "Mexico");

// Check if two states share a border
let has_country_border = await gd.borders(gd.types["state"], "Texas, United States", "Coahuila, Mexico");
```