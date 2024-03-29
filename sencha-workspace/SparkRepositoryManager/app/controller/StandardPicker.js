Ext.define('SparkRepositoryManager.controller.StandardPicker', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.StandardPicker',
    requires: [
        'SparkRepositoryManager.store.StandardsTree',
        'Ext.data.ArrayStore',
        'Ext.Array'
    ],


    config: {
        control: {
            '#': {}
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            view = me.getView(),
            record = view.getRecord(),
            title = record.data.Title;

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
                standards.push(rec.getId());
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
    },

    onStandardsCheck: function(node, checked) {
        var tagField = this.lookupReference('tagfield');

        if (checked) {
            tagField.addValue(node.getId());
        } else {
            tagField.removeValue(node.getId());
        }
    },

    onBeforeTagFieldSelect: function(combo, record) {
        var node = Ext.getStore('StandardsTree').getRoot().findChild('id', record.getId(), true);

        if (typeof node.get('checked') === 'boolean') {
            node.set('checked', true);
        }

        node.parentNode.expand();
    },

    onBeforeTagFieldDeselect: function(combo, record) {
        var node = Ext.getStore('StandardsTree').getRoot().findChild('id', record.getId(), true);

        if (typeof node.get('checked') === 'boolean') {
            node.set('checked', false);
        }

        // TODO: should we collapse the parent here if it has no other children checked?
    }
});
