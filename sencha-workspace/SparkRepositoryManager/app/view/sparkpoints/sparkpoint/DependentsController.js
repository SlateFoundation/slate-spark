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
        }
    },

    onDeleteClick: function(grid,rec) {
        Ext.Msg.confirm('Deleting Dependent', 'Are you sure you want to delete this dependent?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
            }
        });
    }

});
