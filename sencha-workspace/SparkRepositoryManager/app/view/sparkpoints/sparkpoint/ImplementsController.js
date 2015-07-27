/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.ImplementsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointimplements',

    control: {
        '#': {
            deleteclick: 'onDeleteClick'
        }
    },

    onDeleteClick: function(grid,rec) {
        Ext.Msg.confirm('Deleting Implement', 'Are you sure you want to delete this implement?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
            }
        });
    }

});
