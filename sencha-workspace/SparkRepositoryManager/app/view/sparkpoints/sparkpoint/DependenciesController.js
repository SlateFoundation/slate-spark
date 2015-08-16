/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.DependenciesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointdependencies',
    requires: [
        'SparkRepositoryManager.model.SparkpointEdge'
    ],


    control: {
        '#': {
            deleteclick: 'onDeleteClick'
        },
        'combo': {
            boxready: 'onComboBoxReady',
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

        Ext.Msg.confirm('Deleting Dependency', 'Are you sure you want to delete this dependency?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
                // me.filterCombo();
            }
        });
    },

    onComboBoxReady: function() {
        // this.filterCombo();
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

    addRecord: function() {
        var me = this,
            treePanel = me.getView(),
            treeRootNode = treePanel.getRootNode(),
            lookupCombo = me.lookupReference('lookupCombo'),
            thisSparkpoint = treeRootNode.get('source_sparkpoint'),
            otherSparkpoint = lookupCombo.getSelectedRecord(),
            edge = Ext.create('SparkRepositoryManager.model.SparkpointEdge', {
                rel_type: 'dependency',
                target_sparkpoint_id: otherSparkpoint.getId(),
                source_sparkpoint_id: thisSparkpoint.getId(),
            });

        treePanel.mask('Saving…');
        edge.save({
            params: {
                sparkpoint_id: thisSparkpoint.getId()
            },
            success: function() {
                treeRootNode.appendChild(edge);
                lookupCombo.clearValue();
                treePanel.unmask();
                thisSparkpoint.set('dependencies_count', thisSparkpoint.get('dependencies_count') + 1);
            }
        });
    },

//     filterCombo: function() {
//         var treepanel = this.getView(),
//             treeStore = treepanel.getStore(),
//             combo = treepanel.down('combo'),
//             comboStore = combo.getStore();
//             debugger;
// console.log('filtering dependencies combo');
//         comboStore.filterBy(function(comboRec) {
//             if (treeStore.find('code',comboRec.get('code')) !== -1) {
//                 return false;
//             }
//             return true;
//         });
    // }
});
