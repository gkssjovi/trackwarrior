#!/usr/bin/env node

const Init = require('./library/Init');

const main = async () => {
    const { parser } = await Init();
    const { config, intervals } = parser;
    
    const ids = intervals.getIds(true);
    process.stdout.write(ids);
};

main();





































