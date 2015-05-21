Ext.define('Spark2Manager.controller.StandardPicker', {
    requires: [
        'Spark2Manager.store.StandardsTree',
        'Ext.data.ArrayStore',
        'Ext.Array'
    ],

    extend: 'Ext.app.ViewController',

    alias: 'controller.StandardPicker',

    config: {
        control: {
            '#': {}
        }
    },

    stores: [
        'StandardsTree'
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
            tagField = view.lookupReference('tagfield'),
            standards = view.getStandards();

        if (store.isLoaded()) {
            store.restoreState(standards);
        }

        if (standards) {
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode || standard;
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

        me.getView().fireEvent('alignstandards', record, standards);

        // Uncheck checked check boxes
        checkedItems.forEach(function (item) {
            item.set('checked', false);
        });

        tree.collapseAll();

        tagField.clearValue();

        me.getView().close();

        if (window.ga) {
            ga('send', 'event', 'standards', 'align', 'standard picker', checkedItems.length);
        }
    },

    onStandardsCheck: function(node, checked) {
        var tagField = this.lookupReference('tagfield');

        if (checked) {
            tagField.addValue(node.get('standardCode'));
        } else {
            tagField.removeValue(node.get('standardCode'));
        }
    },

    onBeforeTagFieldSelect: function(combo, record, index, eOpts) {
        var node = Ext.getStore('StandardsTree').getRoot().findChild('standardCode', record.get('code'), true);

        if (typeof node.get('checked') == 'boolean') {
            node.set('checked', true);
        }

        node.parentNode.expand();
    },

    onBeforeTagFieldDeselect: function(combo, record, index, eOpts) {
        var node = Ext.getStore('StandardsTree').getRoot().findChild('standardCode', record.get('code'), true);

        if (typeof node.get('checked') != 'undefined') {
            node.set('checked', true);
        }

        // TODO: should we collapse the parent here if it has no other children checked?
    }
});
