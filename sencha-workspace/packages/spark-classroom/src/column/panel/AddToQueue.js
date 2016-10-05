Ext.define('SparkClassroom.column.panel.AddToQueue', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-addtoqueue-popover',

    config: {
        cls: 'spark-addtoqueue-popover',
        modal: true,
        hideOnMaskTap: true,
        listeners: {
            hide: {
                fn: function() {
                    Ext.select('.is-stuck').each(function() {
                        this.removeCls('is-stuck');
                    });
                }
            }
        },
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
                                this.up('spark-addtoqueue-popover').hide();
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