Ext.define('SparkClassroom.assign.Popup', {
    extend: 'Ext.Panel',
    xtype: 'spark-assign-popup',
    requires: [
        'Jarvus.plugin.GridFlex'
    ],

    manageBorders: false, // manageBorders adds a class that leaks down to the grid and hides the bottom border on its header

    config: {
        cls: 'spark-teacher-assign-popup',
        floating: true,
        height: 400,
        width: 560,
        margin: 0,
        layout: 'fit',
        items: [
            {
                xtype: 'grid',
                titleBar: null,
                margin: 0,
                store: 'assign.Learn',
                plugins: [
                    'gridflex'
                ],
                columns: [
                    {
                        dataIndex: 'SRating',
                        xtype: 'spark-assign-column-multi',
                        showTrigger: false
                    },
                    {
                        dataIndex: 'Title',
                        text: 'Name',
                        flex: 1
                    },
                    {
                        dataIndex: 'Standards',
                        text: 'Current Standard',
                        flex: 1
                    }
                ]
            }
        ]
    },

    showBy: function(component, alignment) {
        var me = this,
            //tipEl = me.tipElement,
            scrollable = me.up('{getScrollable()}').getScrollable(),
            targetEl = Ext.get(component),
            x = targetEl.getLeft(),
            y = targetEl.getTop();

        me.setVisibility(false);
        me.show();

        // shift to accomodate scrollable parent
        if (scrollable) {
            y += scrollable.getPosition().y;
            y -= scrollable.getElement().getTop();
        }

        // show and position tip -- doesn't seem to have any styling at all
        // tipEl.show();
        // tipEl.addCls('x-anchor-top');

        // shift to desired corners based on size of popup and target
        x -= me.getWidth() - targetEl.getWidth();
        y += targetEl.getHeight();

        me.setLeft(x);
        me.setTop(y);
        me.setVisibility(true);
    }
});