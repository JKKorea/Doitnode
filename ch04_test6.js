// ERROR : throw err
var fs = require('fs');

fs.readFile('./package.json', 'utf8', function(err, data) {
  if(err) throw err;
    // the data is passed to the callback in the second argument
  console.log(data);
});