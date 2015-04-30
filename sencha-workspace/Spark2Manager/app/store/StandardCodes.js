Ext.define('Spark2Manager.store.StandardCodes', {
    extend: 'Ext.data.JsonStore',
    config: {
        idProperty: 'code',
        proxy: {
            type: 'ajax',
            url: '/spark2/standards.json',
            reader: {
                type: 'json'
            }
        },

        fields: [
            'code',
            'grades',
            'subject',
            'description'
        ]
    }
});
