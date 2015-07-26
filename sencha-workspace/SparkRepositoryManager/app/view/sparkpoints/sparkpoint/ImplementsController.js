Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.ImplementsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointimplements',


    control: {
        '#': {
            afterrender: 'onAfterRender'
        }
    },

    onAfterRender: function(grid) {
        var view = grid.getView(),
            tip;

        tip = Ext.create('Ext.tip.ToolTip', {
            target: view.el,
            delegate: view.getCellSelector(),
            tpl: grid.getTooltipTemplate(),
            trackMouse: true,
            renderTo: Ext.getBody(),
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    // Only show tip if this is the first cell
                    if (Ext.fly(tip.triggerElement).hasCls('x-grid-cell-first')) {
                        tip.update(view.getRecord(tip.triggerElement));
                    } else {
                        return false;
                    }
                }
            }
        });
    }
});
