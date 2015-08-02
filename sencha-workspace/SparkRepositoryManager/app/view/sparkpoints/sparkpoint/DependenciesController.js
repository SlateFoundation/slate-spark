/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointdependencies',

    refs: {
        tree: 'srm-sparkpoints-sparkpointdependencies'
    },

    control: {
        '#': {
            deleteclick: 'onDeleteClick'
        },
        'combo': {
            // TODO: on focus? maybe not, but works for now
            focus: 'onComboFocus',
            select: 'onComboSelect',
            change: 'onComboChange',
            specialKey: 'onComboSpecialKey'
        },
        'button[action="add"]': {
            click: 'onAddClick'
        }
    },

    onDeleteClick: function(grid,rec) {
        Ext.Msg.confirm('Deleting Dependency', 'Are you sure you want to delete this dependency?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
            }
        });
    },

    onComboFocus: function(combo) {
        var comboStore = combo.getStore(),
            treeStore = combo.up('treepanel').getStore();

        comboStore.filterBy(function(comboRec) {
            if (treeStore.find('code',comboRec.get('code')) !== -1) {
                return false;
            }
            return true;
        });
    },

    onComboSelect: function(combo) {
        var treepanel = combo.up('treepanel'),
            addButton = treepanel.down('button[action="add"]');

        addButton.enable();
    },

    onComboChange: function(combo) {
        var button = combo.up('toolbar').down('button');

        if (!combo.findRecordByValue(combo.getValue())) {
            button.disable();
        }
    },

    onComboSpecialKey: function(combo, e) {
        if (e.getKey() == e.ENTER && combo.findRecordByValue(combo.getValue())) {
            this.addRecord();
        }
    },

    onAddClick: function() {
        this.addRecord();
    },

    // TODO: just adding rec to root for now, but I would think this will require a server reload to rebuild tree store.
    addRecord: function() {
        var treepanel = this.getView(),
            treeStore = treepanel.getStore(),
            root = treeStore.getRoot(),
            button = treepanel.down('button'),
            combo = treepanel.down('combo'),
            comboStore = combo.getStore(),
            comboIdx = comboStore.find('code',combo.getValue()),
            comboRec = comboStore.getAt(comboIdx);

        root.set('leaf', false);

        root.appendChild(Ext.apply(comboRec.getData(),{leaf:true}));

        // TODO: These statements would be done in a callback if we reload this tree panel's store
        combo.clearValue();
        button.disable();
    }
});
