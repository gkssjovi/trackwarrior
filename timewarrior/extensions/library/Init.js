
const readline = require('readline');
const Parser = require('./Parser');

async function Init() {
    let input = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    for await (const line of rl) {
        input.push(line);
    }
    
    const parser = new Parser(input);

    return {
        parser,
    };
}

module.exports = Init;