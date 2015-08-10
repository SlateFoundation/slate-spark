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
    displayField: 'standardCode',
    valueField: 'standardCode',
    queryMode: 'local',
    publishes: 'value',
    filterPickList: true,
    forceSelection: true,
    selectOnFocus: false,
    multiSelect:  true,
    anyMatch: true,
    stacked: true,
    triggerAction: 'query',

    getModelData: function() {
        return {
            'Standards':
                Ext.Array.map(this.valueStore.collect('standardCode'), function(code) {
                    return { standardCode: code }
                })
        };
    }
});