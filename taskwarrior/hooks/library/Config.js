

class Config {
    data = {};

    constructor(data) {
        this.data = data;
        
    }

    get(key = null, defaultValue = '') {
        if (!key) {
            return this.data;
        }
        
        if (this.has(key)) {
            return this.data[key];
        }

        return defaultValue;
    }
    
    getBool(key) {
        const value = this.get(key);
        return /^(on|1|yes|y|true)$/i.test(value);
    }
    
    getInt(key) {
        const value = this.get(key);
        return !isNaN(Number(value)) ? Number(value) : 0;
    }

    getArray(key, defaultValue = []) {
        const value = this.get(key);
        
        if (typeof value === 'string') {
            let result = value.split(',');
            if (result.length == 1 && result[0].trim() == '') {
                return [];
            }
            
            return result.map(item => item.trim());
        }
        
        return defaultValue;
    }
    
    has(key) {
        return Object.prototype.hasOwnProperty.call(this.data, key);
    }
}

module.exports = {
    Config,
};