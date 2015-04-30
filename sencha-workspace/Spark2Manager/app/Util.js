Ext.define('Spark2Manager.Util', {
    'singleton': true,

    'requires': [
        'Ext.Object'
    ],

    parseURL: function(url) {
        var returnVal = {};

        try {
            returnVal = new URL(url);
            returnVal.params = Ext.Object.fromQueryString(returnVal.search);
            delete returnVal.search;
        } catch (e) {
            return null;
        }

        return returnVal;
    },

    titleTruncators: {
        'learnzillion.com': function(title) {
            return title.replace('- for students', '').trim();
        }
    },

    truncateTitle: function(title, vendor, hostname) {
        var pattern = '',
            reRight,
            reLeft,
            customFn = this.titleTruncators[hostname];

        if (vendor && vendor.data) {
            pattern = vendor.data.Name.replace(/\s/, '').split('').join('\\s*');
        }

        if (hostname) {
            hostname = hostname.split('.').slice(0, -1).join('').split('');
            pattern += (pattern ? '|' : '') + hostname.join('\\s*');
        }

        reRight = new RegExp('\\s(.{0,2})' + pattern, 'i');
        reLeft = new RegExp(pattern + '.{0,2}\\s*', 'i');

        title = title.replace(reRight, '').replace(reLeft, '');

        return (typeof customFn === 'function') ? customFn(title) : title;
    },

    guessNameFromTitle: function guessNameFromTitle(title, hostname) {
        title = title || document.querySelectorAll('title')[0].textContent;
        hostname = hostname || location.hostname;

        var re = new RegExp(hostname.split('.').join('').split('').join('\\s*'), 'i'),
            // check with TLD in place (jarv.us)
            name = title.match(re);

        if (!name) {
            // check without TLD
            re = new RegExp(hostname.split('.').slice(0, -1).join('').split('').join('\\s*'), 'i');
            name = title.match(re);
        }

        // TODO: visit root/index page of domain and diff the titles for common elements?

        // If no matches are found, return the hostname (with TLD)
        return name[0] || hostname;
    }
});
