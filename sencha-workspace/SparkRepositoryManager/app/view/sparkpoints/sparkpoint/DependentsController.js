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
            // TODO: on focus? maybe not, but works for now
            focus: 'onComboFocus',
            select: 'onComboSelect'
        },
        'button[action="add"]': {
            click: 'onAddClick'
        }
    },

    onDeleteClick: function(grid,rec) {
        Ext.Msg.confirm('Deleting Dependent', 'Are you sure you want to delete this dependent?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
            }
        });
    },

    onComboFocus: function(combo) {
        var comboStore = combo.getStore(),
            treeStore = combo.up('treepanel').getStore();

        comboStore.filterBy(function(comboRec) {
            if (treeStore.find('Code',comboRec.get('Code')) !== -1) {
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

    // TODO: just adding rec to root for now, but I would think this will require a server reload to rebuild tree store.
    onAddClick: function(button) {
        var treepanel = button.up('treepanel'),
            treeStore = treepanel.getStore(),
            root = treeStore.getRoot(),
            combo = treepanel.down('combo'),
            comboStore = combo.getStore(),
            comboIdx = comboStore.find('Code',combo.getValue()),
            comboRec = comboStore.getAt(comboIdx);

        root.set('leaf', false);

        root.appendChild(Ext.apply(comboRec.getData(),{leaf:true}));
    }
});
