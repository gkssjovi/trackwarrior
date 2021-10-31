

function parseUTCDate(str) {
    const match = str.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
    return new Date(Date.UTC(
            parseInt(match[1]),
            parseInt(match[2]) - 1,
            parseInt(match[3]),
            parseInt(match[4]),
            parseInt(match[5]),
            parseInt(match[6])
        ));
}

function escapeTags(tags) {
    return tags.map(tag => {
        return (/\s/.test(tag) ? `"${tag.replace(/"/g, "\\\"")}"` : tag);
    });
}

module.exports = {
    parseUTCDate,
    escapeTags,
};