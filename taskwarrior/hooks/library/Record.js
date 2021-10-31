
const { formatTime } = require('./tools')
const { config, settings } = require('./settings')

const STATUS_DELETED = 'deleted';
const STATUS_PENDING = 'pending';
const STATUS_START = 'start';
const STATUS_COMPLETED = 'completed';

class Record {
    data = null
    cleartime = false

    constructor(data) {
        this.data = data;

        if (this.data.tags) {
            this.data.tags = this.data.tags.filter(tag => {
                const clearTimeTags = config.getArray('clear_time_tags', settings.clearTimeTags);
                const condition = !clearTimeTags.includes(tag);
                if (!condition) {
                    this.cleartime = true;
                }
                return condition;
            });
        }
    }
    
    hasCleartime() {
        return this.cleartime;
    }

    getEntry() {
        return this.get('entry');
    }
    
    getDuration() {
        return this.get('trackwarrior');
    }
    
    getStatus() {
        return this.get('status');
    }
    
    delete(key) {
        delete this.data[key];
    }
    
    setDuration(value) {
        value = String(value).trim();
        const duration = !isNaN(parseInt(value)) ? formatTime(value) : formatTime('0');
        this.set('trackwarrior', duration);
    }
    
    hasStart() {
        return this.get('start') ? true : false;
    }
    
    set(key, value) {
        this.data[key] = value;
    }

    get(key = null, defaultValue = '') {
        if (!key) {
            return this.data;
        }

        if (Object.prototype.hasOwnProperty.call(this.data, key)) {
            return this.data[key];
        }
        return defaultValue;
    }
    
    getId(format = true) {
        const id = this.data.uuid.split('-')[0];
        if (format) {
            // `:${id}` display at the begining of the table based on ascii, `|${id}|` on the end of the table
            return `|${id}|`;
        }
        return id;
    }
    
    getUUID() {
        return this.data.uuid;
    }
    
    getDescription() {
        return this.data.description;
    }
    
    getTags(escaped = false) {
        const { data } = this;

        let tags = [
            this.getId(),
            data.description
        ];
    
        if (data.project) {
            if (!tags.includes(data.project)) {
                tags.push(data.project);
            }
        }
        
        if (data.tags) {
            tags = tags.concat(data.tags.filter((tag) => !tags.includes(tag)));
        }
 
        if (!escaped) {
            return tags;
        }
        
        return tags.map(tag => {
            return (/\s/.test(tag) ? `"${tag.replace(/"/g, "\\\"")}"` : tag);
        });
    }
    
    getAnnotation = () => {
        const { data } = this;
        if (!data.annotations) {
            return '';
        }
        
        return data.annotations[0].description;
    }
    
    output() {
        return JSON.stringify(this.data);
    }
}


module.exports = {
    Record,
    STATUS_DELETED,
    STATUS_PENDING,
    STATUS_START,
    STATUS_COMPLETED,
};