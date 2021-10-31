
const Interval = require('./Interval');

class Intervals {
    data = [];
    intervals = [];

    constructor(data) {
        this.data = data;
        
        this.intervals = this.data.map(item => new Interval({
            id: item.id,
            start: item.start,
            end: item.end,
            tags: item.tags,
            annotation: item.annotation,
        }));
    }
    
    get() {
        return this.intervals;
    }
    
    getData() {
        return this.data;
    }

    getIds(string = false) {

        const ids = this.intervals.map(interval => interval.getId());
        
        if (string) {
            return ids.join(' ').trim();
        }
        
        return ids;
    }
    
    getDuration(seconds = true) {
        const duration = this.intervals.reduce((total, interval) => total + interval.getDuration(false), 0);
        
        return seconds ? Math.trunc(duration / 1000) : duration;
    }
}

module.exports = Intervals;