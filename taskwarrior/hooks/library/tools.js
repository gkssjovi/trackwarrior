
function formatWithSpaces(value, spaces = 10) {
    let diff = spaces - String(value).length;
    
    if (diff < 0) {
        diff = 0;
    }
   
    return `${' '.repeat(diff)}${value}`;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
        h,
        // m > 9 ? m : (h ? '0' + m : m || '0'),
        m > 9 ? m : '0' +m ,
        s > 9 ? s : '0' + s
    ].join(':');
}

function sameArray(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return arr1.every(item => set2.has(item)) &&
        arr2.every(item => set1.has(item))
};

module.exports = {
    formatTime,
    sameArray,
    formatWithSpaces,
};