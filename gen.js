'use strict';

var moduleName = process.argv[2],
    fs         = require('fs');

if(!moduleName){

  console.error('Module name should be specified');
  return;
}
console.log('Creating model');
fs.readFile('./server/models/_EXAMPLE', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/%_MODEL_NAME_%/g, moduleName);

  fs.writeFile('./server/models/'+moduleName+'.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating route');
fs.readFile('./server/routes/_EXAMPLE', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/%_MODEL_NAME_%/g, moduleName);

  fs.writeFile('./server/routes/'+moduleName+'.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating client model');
fs.readFile('./app/scripts/models/_EXAMPLE', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/%_MODEL_NAME_%/g, moduleName.charAt(0).toUpperCase() + moduleName.slice(1));

  result = result.replace(/%_ROUTE_%/g, moduleName.toLowerCase() + 's');

  fs.writeFile('./app/scripts/models/'+moduleName+'.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating client collection');
fs.readFile('./app/scripts/collections/_EXAMPLE', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/%_MODEL_NAME_%/g, moduleName.toLowerCase());

  result = result.replace(/%_ROUTE_%/g, moduleName.toLowerCase() + 's');
  result = result.replace(/%_COLLECTION_NAME_%/g, moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 's');

  fs.writeFile('./app/scripts/collections/'+moduleName + 's' + '.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Module "'+moduleName + '" successfully created');