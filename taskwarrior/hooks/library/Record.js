
const { formatTime, formatWithSpaces } = require('./tools')
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
            const clearTimeTags = config.getArray('clear_time_tags', settings.clearTimeTags);
            const updateTimeTags = config.getArray('update_time_tags', settings.clearTimeTags);
            this.data.tags = this.data.tags.filter(tag => {
                const condition = !clearTimeTags.includes(tag);
                if (!condition) {
                    this.cleartime = true;
                }

                return condition && !updateTimeTags.includes(tag);
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
        const duration = !isNaN(parseInt(value)) ? parseInt(value) : 0;

        this.set('trackwarrior', duration != 0 ? formatTime(String(duration)) : '');
        
        let ratePerHour = config.getInt('rate_per_hour', settings.ratePerHour);
        const currencyFormat = config.getArray('currency_format', settings.currencyFormat);
        
        const project = this.get('project', '');
        if (project.length > 0) {
            const ratePerHourProject = config.getArray('rate_per_hour_project', settings.ratePerHourProject);
            const rates = {};
            for (let item of ratePerHourProject) {
                const [projectName, projectRate] = item.split(':');
                rates[projectName.trim()] = !isNaN(Number(projectRate.trim())) ? Number(projectRate.trim()) : 0;
            }
            
            if (Object.keys(rates).includes(project)) {
                ratePerHour = rates[project];
            }
        }
        
        const total = ((ratePerHour / 3600) * duration);
        const formatConfig = {
            style: 'currency',
            currency: currencyFormat[1],
            useGrouping: true,
        };
        
        const amountDecimals = {};
        
        const decimals = config.getInt('rate_per_hour_decimals', settings.ratePerHourDecimals);
        
        const amountFormatter = Intl.NumberFormat(currencyFormat[0], {
            ...formatConfig,
            ...amountDecimals,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
        const rateFormatter = Intl.NumberFormat(currencyFormat[0], {
            ...formatConfig,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        
        const ratelFormatted = ratePerHour == 0 ? '' : `${rateFormatter.format(ratePerHour)}`;
        this.set('trackwarrior_rate', ratelFormatted);

        const spaces = config.getInt('rate_format_with_spaces', settings.rateFormatWithSpaces);
        const totalFormatted = total == 0 ? '' : formatWithSpaces(amountFormatter.format(total), spaces);
        this.set('trackwarrior_total_amount', totalFormatted);
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
