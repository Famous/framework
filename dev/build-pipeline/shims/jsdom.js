module.exports = {
    jsdom: function(domString) {
        var domParser = new DOMParser();
        var doc = domParser.parseFromString(domString, 'text/html');
        return {
            defaultView: {
                'document': doc
            }
        };
    }
};
