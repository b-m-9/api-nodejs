var config = require('./index.js');
config.set('example:name', 'value', 'testField[true(no resave),false(resave)]', 'keyConfig','noSaveTofile[true(no Save file now),false( save to file now)]');
config.get('example:name','keyConfig'); // return value
config.rereadConfig(); // reload config file
config.getAllToJsonConfig((err,conf)=>{
    if(err) config.error(err);
    console.log(conf); // json config
}); // get config file to JSON


config.save(); // save to file now