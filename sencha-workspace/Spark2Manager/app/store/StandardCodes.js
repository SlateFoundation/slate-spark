Ext.define('Spark2Manager.store.StandardCodes', {
    extend: 'Ext.data.JsonStore',
    config: {
        noCache: false,
        idProperty: 'code',
        proxy: {
            type: 'ajax',
            url: 'http://slate.ninja/spark2/standards.json',
            reader: {
                type: 'json'
            },
            noCache: false,
            pageParam: undefined,
            startParam: undefined,
            sortParam: undefined,
            limitParam: undefined
        },

        fields: [
            'code',
            'grades',
            'subject',
            'description'
        ]
    }
});
