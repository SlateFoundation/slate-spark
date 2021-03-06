/**
 * TODO:
 * - Use primary edges store for add/remove operations and have tree stores mirror it? Then main controller can manage counts by listening to the edges store
 * - Deduplicate code between this and the dependents controller
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
            beforequery: 'onComboBeforeQuery',
            change: 'onComboChange',
            specialKey: 'onComboSpecialKey'
        },
        'button[action=add]': {
            click: 'onAddClick'
        }
    },

    onDeleteClick: function(grid, rec) {
        var treePanel = this.getView(),
            sparkpoint = treePanel.getRootNode().get('source_sparkpoint');

        Ext.Msg.confirm('Deleting Dependency', 'Are you sure you want to delete this dependency?', function(btn) {
            if (btn !== 'yes') {
                return;
            }

            treePanel.mask('Deleting…');
            rec.erase({
                success: function() {
                    sparkpoint.set('dependencies_count', sparkpoint.get('dependencies_count') - 1);
                    treePanel.unmask();
                }
            });
        });
    },

    onComboBeforeQuery: function(queryPlan) {
        var treeStore = this.getView().getStore(),
            excludeSparkpointIds = Ext.Array.union(
                treeStore.collect('source_sparkpoint_id'),
                treeStore.collect('target_sparkpoint_id'),
                treeStore.getRootNode().get('source_sparkpoint').getId()
            );

        queryPlan.combo.getStore().filterBy(function(sparkpoint) {
            return excludeSparkpointIds.indexOf(sparkpoint.getId()) === -1;
        });
    },

    onComboChange: function(lookupCombo) {
        this.lookupReference('addButton').setDisabled(!lookupCombo.getSelectedRecord());
    },

    onComboSpecialKey: function(combo, e) {
        if (e.getKey() === e.ENTER) {
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
            edge = otherSparkpoint && Ext.create('SparkRepositoryManager.model.SparkpointEdge', {
                'rel_type': 'dependency',
                'target_sparkpoint_id': otherSparkpoint.getId(),
                'source_sparkpoint_id': thisSparkpoint.getId()
            });

        if (!edge) {
            return;
        }

        treePanel.mask('Saving…');
        edge.save({
            params: {
                'sparkpoint_id': thisSparkpoint.getId()
            },
            success: function() {
                treeRootNode.appendChild(edge);
                lookupCombo.clearValue();
                treePanel.unmask();
                thisSparkpoint.set('dependencies_count', thisSparkpoint.get('dependencies_count') + 1);
            },
            failure: function(savedEdge, operation) {
                // TODO: test if decoding JSON here is necessary, apikit should be handling it
                var response = operation.getError().response,
                    responseData = response.getResponseHeader('Content-Type') === 'application/json' && Ext.decode(response.responseText, true),
                    message = responseData && responseData.message || 'An unknown failure occured, please try again later or contact your technical support';

                Ext.Msg.alert('Failed to save dependency', message.replace(/.*ERROR:\s*/, ''));
                treePanel.unmask();
            }
        });
    }
});
