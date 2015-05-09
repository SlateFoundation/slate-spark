Ext.define('Spark2Manager.controller.StandardPicker', {
    requires: [
        'Spark2Manager.store.StandardsTree',
        'Spark2Manager.store.StandardPicker',
        'Spark2Manager.store.StandardCodes',
        'Ext.data.ArrayStore'
    ],

    extend: 'Ext.app.ViewController',

    alias: 'controller.StandardPicker',

    config: {
        control: {
            '#': {}
        }
    },

    stores: [
        'StandardsTree',
        'StandardPicker',
        'StandardCodes'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            view = me.getView(),
            record = view.getRecord(),
            title = record.data.Title,
            treeStore = me.lookupReference('tree').getStore();

        window.treeStore = treeStore;
        window.view = view;

        view.setTitle(title || 'Standard Alignment');

        this.listen({
            store: {
                '#StandardsTree': {
                    load: this.onTreeStoreLoad
                }
            }
        });
    },

    onTreeStoreLoad: function() {
        // The first time the window is shown, the store isn't loaded, this makes sure we restore the state on first run
        Ext.getStore('StandardsTree').restoreState(this.getView().getRecord());
    },

    onPanelActivate: function () {
        var me = this,
            store = Ext.getStore('StandardsTree'),
            view = me.getView(),
            record = view.getRecord(),
            tagField = view.lookupReference('tagfield'),
            standards = record.get('Standards');

        if (store.isLoaded()) {
            store.restoreState(record);
        }

        if (standards) {
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        }
    },

    onAlignStandardsClick: function () {
        var me = this,
            record = me.getView().getRecord(),
            tree = me.lookupReference('tree'),
            treeStore = tree.getStore(),
            checkedItems,
            standards = [],
            tagField = me.lookupReference('tagfield');

        checkedItems = treeStore.getChecked();

        Ext.Array.each(checkedItems, function (rec) {
            if (rec.get('checked')) {
                standards.push({standardCode: rec.get('standardCode')});
            }
        });

        record.set('Standards', standards);
        // Uncheck checked check boxes
        checkedItems.forEach(function (item) {
            item.set('checked', false);
        });

        tree.collapseAll();

        tagField.clearValue();

        me.getView().close();
    },

    onStandardsCheck: function(node, checked, eOpts) {
        var tagField = this.lookupReference('tagfield');

        if (checked) {
            tagField.addValue(node.get('standardCode'));
        } else {
            tagField.removeValue(node.get('standardCode'));
        }
    }

    /*
    onBeforeTagFieldDeselect: function(combo, record, index, eOpts) {
        Ext.getStore('StandardsTree').findRecord('standardCode', record.get('code')).set('checked', false);
    }*/
});
