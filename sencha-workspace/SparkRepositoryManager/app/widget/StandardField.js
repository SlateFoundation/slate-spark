Ext.define('SparkRepositoryManager.widget.StandardField', {
    extend: 'Ext.form.field.Tag',
    xtype: 'spark-standardfield',
    requires: [
        'Ext.data.ChainedStore'
    ],

    lazyAutoLoad: false,

    config: {
        // store: 'StandardCodes',
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
        triggerAction: 'query'
    },

    initComponent: function() {
        var me = this;

        if (!me.store) {
            me.store = Ext.create('Ext.data.ChainedStore', {
                source: 'StandardCodes'
            });
        }

        me.callParent();
    },

    getModelData: function() {
        return {
            'Standards':
                Ext.Array.map(this.valueStore.collect('standardCode'), function(code) {
                    return { standardCode: code }
                })
        };
    }
});