/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.AlignmentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointalignments',

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

        Ext.Msg.confirm('Deleting Alignment', 'Are you sure you want to delete this alignment?', function(btn) {
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
        var grid = combo.up('gridpanel'),
            addButton = grid.down('button[action="add"]');

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

    addRecord: function() {
        var grid = this.getView(),
            gridStore = grid.getStore(),
            button = grid.down('button'),
            combo = grid.down('combo'),
            comboStore = combo.getStore(),
            comboIdx = comboStore.find('code',combo.getValue()),
            comboRec = comboStore.getAt(comboIdx);

        gridStore.add(comboRec);

        // TODO: These statements would be done in a callback when we can save the new record
        combo.clearValue();
        button.disable();
        this.filterCombo();
    },

    filterCombo: function() {
        var grid = this.getView(),
            gridStore = grid.getStore(),
            combo = grid.down('combo'),
            comboStore = combo.getStore();

        comboStore.filterBy(function(comboRec) {
            if (gridStore.find('code',comboRec.get('code')) !== -1) {
                return false;
            }
            return true;
        });
    }
});
