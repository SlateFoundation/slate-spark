Ext.define('SparkClassroom.column.panel.AddToQueue', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-addtoqueue-popover',

    config: {
        cls: 'spark-addtoqueue-popover',

        modal: {
            style: 'opacity: 0'
        },

        hideOnMaskTap: true,

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
                    margin: '10 0 0',
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function() {
                                this.up('spark-addtoqueue-popover').destroy();
                                Ext.select('.is-stuck').each(function() {
                                    this.removeCls('is-stuck');
                                });
                            }
                        }
                    }
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