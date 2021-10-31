
const Config = require('./Config');
const Intervals = require('./Intervals');

class Parser {
    config = {};
    intervals = [];

    constructor(input) {
        const { config, intervals } = this.parse(input);
        
        this.config = new Config(config);
        this.intervals = new Intervals(intervals);
    }
    
    parse(input) {
        const config = {};

        let configEnd = false;
        let intervals = '';
        for (const line of input) {
            if (line == '') {
                configEnd = true;
            }
            
            if (!configEnd) {
                const [left, right] = line.split(':');
                config[left] = right.trim();
            } else {
                intervals += line;
            }
        }
        intervals = JSON.parse(intervals);
        
        return {
            config,
            intervals,
        };
    }
}

module.exports = Parser;