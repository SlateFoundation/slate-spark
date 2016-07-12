Ext.define('SparkClassroom.column.panel.AddToQueue', {
    extend: 'Ext.Panel',
    xtype: 'spark-addtoqueue-popover',

    config: {
        cls: 'spark-addtoqueue-popover',
        left: 0, // left is required due to bug EXTJS-17697
        items: [
            {
                xtype: 'component',
                styleHtmlContent: true,
                html: '<strong>Add to queue for all students?</strong>'
            },
            {
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    ui: 'action',
                    margin: '10 0 0'
                },
                items: [
                    {
                        text: 'Add to Queue'
                    },
                    {
                        margin: '10 0 0 10',
                        text: 'Add Next Up'
                    }
                ]
            }
        ]
    }
});