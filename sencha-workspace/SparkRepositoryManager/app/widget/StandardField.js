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

    listeners: {
        change: function (field, newHeight) {
            var me      = this,
                ownerCt = me.ownerCt,
                rowEditor = me.up('roweditor');

            if (rowEditor) {
                /* HACK: while rowediting, when the tagfield autosizes it pushes the update/cancel roweditor buttons down */
                rowEditor.getFloatingButtons().setButtonPosition('bottom');
            } else if (me.up().$className === 'Ext.saki.grid.MultiSearch') {
                /* HACK: in the filter/multisearch, when the tagfield autosizes, we must also autosize the filter row */
                if (!me.autosized) {
                    /* HACK: https://docs.m.sencha.com/forum/showthread.php?300648-Cannot-read-property-offsetHeight-of-undefined-in-BufferedRenderer-Broken-Ext-5.1&p=1098485&langid=4 */
                    me.autosized = true;
                    return;
                }

                if (ownerCt.height != newHeight) {
                    ownerCt.setHeight(newHeight);
                }
            }
        }
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