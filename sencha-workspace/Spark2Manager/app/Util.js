Ext.define('Spark2Manager.Util', {
    'singleton': true,

    'requires': [
        'Ext.Object'
    ],

    parseURL : function(url) {
        var returnVal = {};

        try {
            returnVal = new URL(url);
            returnVal.params = Ext.Object.fromQueryString(returnVal.search);
            delete returnVal.search;
        } catch (e) {
            return null;
        }

        return returnVal;
    }
});
