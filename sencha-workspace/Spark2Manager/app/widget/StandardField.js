Ext.define('Spark2Manager.widget.StandardField', {
    extend: 'Ext.form.field.Tag',

    xtype: 's2m.standardfield',

    alias: 'widget.standardfield',

    requires: [
        'Ext.Array',
        'Ext.data.ChainedStore'
    ],

    lazyAutoLoad: false,

    config: {
        queryMode: 'local',
        publishes: 'value',
        filterPickList: true,
        forceSelection: true,
        selectOnFocus: false,
        multiSelect:  true,
        anyMatch: true
    },

    initComponent: function() {
        var me = this,
            store;

        if (typeof me.store === 'string') {
            store = Ext.getStore(me.store);
        }

        // Chain the passed in store if it's not already
        if (store.$className !== 'Ext.data.ChainedStore') {
            // HACK: do not use setStore() here as it will try to perform store like activities upon a string
            me.store = Ext.create('Ext.data.ChainedStore', {
                source: store
            });
        }

        me.callParent();
    },

    listeners: {
        autosize: function (field, newHeight) {
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