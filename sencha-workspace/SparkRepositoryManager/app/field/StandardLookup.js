 Ext.define('SparkRepositoryManager.field.StandardLookup', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'srm-field-standardlookup',
    requires: [
        'SparkRepositoryManager.store.standards.Lookup'
    ],


    store: {
        type: 'standards-lookup'
    },
    queryMode: 'remote',
    queryParam: 'q',
    triggerAction: 'query',
    minChars: 2,
    displayField: 'code',
    valueField: 'code',
    forceSelecton: true,
    typeAhead: true
 });