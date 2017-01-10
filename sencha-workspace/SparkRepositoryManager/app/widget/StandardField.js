Ext.define('SparkRepositoryManager.widget.StandardField', {
    extend: 'Ext.form.field.Tag',
    xtype: 'spark-standardfield',
    requires: [
        'Ext.data.ChainedStore'
    ],


    lazyAutoLoad: false,
    store: {
        type: 'chained',
        source: 'StandardCodes'
    },
    displayField: 'code',
    valueField: 'id',
    queryMode: 'local',
    filterPickList: true,
    forceSelection: true,
    selectOnFocus: false,
    multiSelect: true,
    anyMatch: true,
    stacked: true,
    triggerAction: 'query'
});