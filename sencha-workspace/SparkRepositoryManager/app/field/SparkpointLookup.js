 Ext.define('SparkRepositoryManager.field.SparkpointLookup', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'srm-field-sparkpointlookup',
    requires: [
        'SparkRepositoryManager.store.sparkpoints.Lookup'
    ],


    store: {
        type: 'sparkpoints-lookup'
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