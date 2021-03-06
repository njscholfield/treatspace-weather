// Becuase of CORS restrictions on the Dark Sky API I had to make quick proxy for the requests...

const SECRET_KEY = 'Dark Sky API key goes here';

const proxy = require('http-proxy-middleware');
const express = require('express');
const app = express();

app.use(express.static('.'));
app.use('/api/', proxy({
  target: 'https://api.darksky.net/',
  changeOrigin: true,
  pathRewrite: function (path) {
    return path.replace('/api/', `/forecast/${SECRET_KEY}/`);
  }
}));

app.listen(8080, function() {
  console.log('Node app listening on port 8080');
});
