#!/usr/bin/env node

const Init = require('./library/Init');

const main = async () => {
    const { parser } = await Init();
    const { config, intervals } = parser;
    
    const duration = intervals.getDuration(true);
    process.stdout.write(String(duration));
};

main();





































