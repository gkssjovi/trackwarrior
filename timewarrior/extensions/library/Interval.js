
const { parseUTCDate, escapeTags } = require('./tools');


class Interval {
    id = 0;
    start = null;
    end = null;
    tags = [];
    annotation = null;

    constructor(props) {
        this.id = props.id;
        this.start = props.start;
        this.end = props.end || null;
        this.tags = props.tags || [];
        this.annotation = props.annotation || null;
    }
    
    getId() {
        return `@${this.id}`;
    }
    
    getStart() {
        return parseUTCDate(this.start);
    }
    
    getEnd() {
        return (!this.isOpen() ? parseUTCDate(this.end) : null);
    }
    
    getTags(escape = false) {
        if (escape) {
            return escapeTags(this.tags);
        }
        return this.tags;
    }
    
    getAnnotation() {
        return this.annotation;
    }

    getDuration(seconds = true) {
        const start = this.getStart();
        const end = !this.isOpen() ? this.getEnd() : new Date(Date.now());
        const duration = end.getTime() - start.getTime()
        
        return seconds ? Math.trunc(duration / 1000) : duration;
    }
    
    isOpen() {
        return this.end == null;
    }
    
}

module.exports = Interval;