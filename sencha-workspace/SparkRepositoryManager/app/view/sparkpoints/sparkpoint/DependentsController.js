/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.DependentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointdependents',

    control: {
        '#': {
            deleteclick: 'onDeleteClick'
        },
        'combo': {
            afterrender: 'onComboAfterRender',
            select: 'onComboSelect',
            change: 'onComboChange',
            specialKey: 'onComboSpecialKey'
        },
        'button[action="add"]': {
            click: 'onAddClick'
        }
    },

    onDeleteClick: function(grid,rec) {
        var me = this;

        Ext.Msg.confirm('Deleting Dependent', 'Are you sure you want to delete this dependent?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
                me.filterCombo();
            }
        });
    },

    onComboAfterRender: function() {
        this.filterCombo();
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
        this.filterCombo();
    },

    filterCombo: function() {
        var treepanel = this.getView(),
            treeStore = treepanel.getStore(),
            combo = treepanel.down('combo'),
            comboStore = combo.getStore();

        comboStore.filterBy(function(comboRec) {
            if (treeStore.find('code',comboRec.get('code')) !== -1) {
                return false;
            }
            return true;
        });
    }
});
