// Express for Dr. Qi Zhang
//const express = require('C:/Users/QZhang/node_modules/express');

// Express for Jae Woo Kang
const express = require('/Users/gangjaeu/myapp/node_modules/express');

const app = express();
app.listen(3100, ()=> console.log('listening at 3100'))
app.use(express.static('public'))

//nodemon index.js