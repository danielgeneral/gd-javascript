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